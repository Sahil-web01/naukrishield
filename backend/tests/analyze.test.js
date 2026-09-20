import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeJobMessage } from '../services/analyzerService.js';
import { detectRuleViolations } from '../services/ruleEngine.js';
import { scoreWithTfIdf } from '../services/tfidfScorer.js';

test('Rule Engine detects payment demand with exact phrase and offset', () => {
  const text = 'Congratulations! Pay Rs 1,999 to confirm your offer.';
  const violations = detectRuleViolations(text);
  assert.ok(violations.length > 0, 'Should detect rule violation');
  const feeViolation = violations.find(v => v.category === 'Advance Fee Demand');
  assert.ok(feeViolation, 'Should have Advance Fee Demand category');
  assert.equal(feeViolation.severity, 'CRITICAL');
  assert.equal(text.slice(feeViolation.start, feeViolation.end), feeViolation.phrase);
});

test('Rule Engine respects negation and does not falsely flag legitimate anti-scam warnings', () => {
  const text = 'Tata Consultancy Services and official partners will never ask candidates for any registration fees or security deposit.';
  const violations = detectRuleViolations(text);
  const feeViolation = violations.find(v => v.category === 'Advance Fee Demand');
  assert.equal(feeViolation, undefined, 'Negated fee statement must not trigger Advance Fee Demand');
});

test('TF-IDF Scorer scores high-risk text above threshold and extracts key indicators', () => {
  const text = 'Selected for typing job. Pay Rs 1500 registration fee on WhatsApp. Earn Rs 25000 per month.';
  const score = scoreWithTfIdf(text);
  assert.ok(score.probability > 0.6, 'Probability should be high for fee demand and typing job');
  assert.ok(score.top_indicators.length > 0, 'Should contain top indicators');
});

test('Hybrid Analyzer returns INSUFFICIENT_INFO for input shorter than 15 chars', () => {
  const result = analyzeJobMessage('Hi there');
  assert.equal(result.risk_category, 'INSUFFICIENT_INFO');
  assert.equal(result.risk_score, 0.0);
  assert.ok(result.next_steps.length > 0);
});

test('Hybrid Analyzer correctly classifies high-risk scam message', () => {
  const scamText = 'Selected for Data Entry role. Salary Rs 35,000. No interview required. Pay Rs 1,999 registration fee via GPay within 2 hours.';
  const result = analyzeJobMessage(scamText);
  assert.equal(result.risk_category, 'HIGH');
  assert.ok(result.risk_score >= 0.8);
  assert.ok(result.evidence_spans.length >= 2);
  assert.ok(result.limitations.length > 0);
});

test('Hybrid Analyzer classifies authentic interview invitation as LOW risk', () => {
  const legitText = 'Thank you for applying for Frontend Engineer at Acme. We reviewed your GitHub and invite you to a 45-minute Google Meet interview. Acme never asks for any money.';
  const result = analyzeJobMessage(legitText);
  assert.equal(result.risk_category, 'LOW');
  assert.ok(result.risk_score < 0.35);
});
