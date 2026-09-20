import { detectRuleViolations } from './ruleEngine.js';
import { scoreWithTfIdf } from './tfidfScorer.js';
import { runMlPrediction } from './mlBridge.js';

export async function analyzeJobMessage(text) {
  const trimmed = (text || '').trim();
  const charCount = trimmed.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  // Handle messages that are too short to evaluate
  if (charCount < 15) {
    return {
      risk_category: 'INSUFFICIENT_INFO',
      risk_score: 0.0,
      model_assessment: {
        label: 'Inconclusive',
        probability: 0.0,
        confidence: 0.0,
        method: 'Hybrid TF-IDF + Linear SVM',
        top_indicators: []
      },
      evidence_spans: [],
      next_steps: [
        'Please paste the full job offer or message (at least 15 characters).',
        'Include recruiter details, salary, and any payment or interview instructions.'
      ],
      limitations: [
        'Message is too short to analyze.',
        'Employer identity could not be verified.'
      ],
      analysis_version: '1.0.0',
      char_count: charCount,
      word_count: wordCount
    };
  }

  // 1. Run Contextual Rule Engine
  const evidenceSpans = detectRuleViolations(trimmed);

  // 2. Run Keyword TF-IDF Scoring
  const tfIdfAssessment = scoreWithTfIdf(trimmed);

  // 3. Run Trained Python Hybrid Linear SVM Model
  let mlResult = null;
  try {
    mlResult = await runMlPrediction({ text: trimmed });
  } catch (err) {
    // Fall back smoothly if python process times out
  }

  // Combine model outputs
  let modelProbability = mlResult?.probability ?? tfIdfAssessment.probability;
  if (mlResult && mlResult.prediction === 0 && tfIdfAssessment.label === 'Likely Authentic') {
    modelProbability = Math.min(modelProbability, tfIdfAssessment.probability);
  }
  const modelLabel = mlResult?.label === 'Fraudulent' ? 'Suspicious' : (tfIdfAssessment.label || 'Likely Authentic');
  const modelMethod = mlResult?.model_name || 'Hybrid TF-IDF + Linear SVM';

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;

  for (const span of evidenceSpans) {
    if (span.severity === 'CRITICAL') criticalCount++;
    else if (span.severity === 'HIGH') highCount++;
    else if (span.severity === 'MEDIUM') mediumCount++;
  }

  let finalScore = modelProbability;
  let riskCategory = 'LOW';

  if (criticalCount > 0) {
    finalScore = Math.max(finalScore, 0.85 + (criticalCount - 1) * 0.05);
    riskCategory = 'HIGH';
  } else if (highCount >= 2 || (highCount >= 1 && finalScore >= 0.45)) {
    finalScore = Math.max(finalScore, 0.72);
    riskCategory = 'HIGH';
  } else if (highCount === 1 || mediumCount >= 2) {
    finalScore = Math.max(finalScore, 0.48);
    riskCategory = 'MODERATE';
  } else if (mediumCount === 1 || finalScore >= 0.65) {
    riskCategory = 'MODERATE';
  } else {
    riskCategory = 'LOW';
  }

  finalScore = Math.min(1.0, Math.round(finalScore * 100) / 100);

  // Personalized recommendations
  const nextSteps = [];

  if (criticalCount > 0) {
    nextSteps.push('Do NOT send any money or registration fees. Genuine companies never charge candidates.');
    nextSteps.push('Never share UPI PIN, OTPs, or scan QR codes sent by recruiters.');
  }

  if (evidenceSpans.some(s => s.category.includes('Messaging Channel'))) {
    nextSteps.push('Ask the recruiter to email you from their official corporate email ID (e.g. name@company.com).');
  }

  if (evidenceSpans.some(s => s.category.includes('No Interview'))) {
    nextSteps.push('Legitimate jobs require interviews or skill rounds. Be careful of direct job offers.');
  }

  if (evidenceSpans.some(s => s.category.includes('Document Request') || s.category.includes('Premature Document'))) {
    nextSteps.push('Do not share Aadhaar/PAN copies or bank details until you verify the offer on the official portal.');
  }

  nextSteps.push('Check the company’s official careers page directly to see if this position exists.');
  nextSteps.push('Search the recruiter’s phone number, email, or company name online with the word "scam".');

  const limitations = [
    'Analysis is based on text patterns; employer identity is not independently verified.',
    'A low risk score is not a 100% guarantee; always verify before taking action.',
    'No live domain or government registration checks were performed.'
  ];

  return {
    risk_category: riskCategory,
    risk_score: finalScore,
    model_assessment: {
      label: riskCategory === 'HIGH' ? 'Suspicious' : modelLabel,
      probability: modelProbability,
      decision_score: mlResult?.decision_score ?? null,
      threshold: mlResult?.threshold ?? 0.0663,
      method: modelMethod,
      top_indicators: tfIdfAssessment.top_indicators
    },
    evidence_spans: evidenceSpans,
    next_steps: nextSteps,
    limitations,
    analysis_version: '1.0.0',
    char_count: charCount,
    word_count: wordCount
  };
}
