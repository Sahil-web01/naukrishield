const VOCABULARY_WEIGHTS = {
  pay: 0.85,
  fee: 0.82,
  fees: 0.80,
  rs: 0.75,
  registration: 0.72,
  deposit: 0.70,
  refundable: 0.65,
  charges: 0.62,
  'pay rs': 0.95,
  'registration fee': 0.98,
  'refundable security': 0.88,
  'security deposit': 0.90,
  'gate pass': 0.85,
  'courier charges': 0.82,
  'software license': 0.78,
  'joining kit': 0.84,
  'activation fee': 0.86,
  'no interview': 0.92,
  'direct selection': 0.89,
  'direct appointment': 0.86,
  'without interview': 0.91,
  '100 guarantee': 0.88,
  'guaranteed placement': 0.85,
  telegram: 0.74,
  whatsapp: 0.68,
  gpay: 0.88,
  phonepe: 0.88,
  paytm: 0.82,
  upi: 0.80,
  daily: 0.55,
  earn: 0.52,
  'earn rs': 0.78,
  'part time': 0.45,
  'typing job': 0.82,
  'liking youtube': 0.95,
  'copy pasting': 0.90,
  hours: 0.40,
  'within 2': 0.75,
  'today only': 0.70,
  immediately: 0.48,

  // Legitimate recruitment tokens
  'google meet': -0.75,
  zoom: -0.40,
  'take home': -0.65,
  'technical assessment': -0.80,
  hackerrank: -0.82,
  codepair: -0.85,
  'portfolio walkthrough': -0.78,
  github: -0.60,
  docusign: -0.65,
  'formal offer': -0.55,
  'careers portal': -0.70,
  'never charge': -0.90,
  'never ask': -0.92,
  'does not ask': -0.92,
  'no fee': -0.85,
  'official careers': -0.75,
  'screening call': -0.50,
  'compensation discussion': -0.65
};

const BASE_BIAS = -0.45;
const NEGATION_REGEX = /(?:never\s+(?:ask|charge|demand|solicit|require)|does\s+not\s+(?:ask|charge|demand)|do\s+not\s+(?:pay|send|transfer)|free\s+of\s+cost|no\s+(?:fees?|charges?|deposit))/i;

function extractNGrams(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  const ngrams = [];

  for (let i = 0; i < words.length; i++) {
    ngrams.push(words[i]);
    if (i < words.length - 1) {
      ngrams.push(`${words[i]} ${words[i + 1]}`);
    }
  }
  return ngrams;
}

export function scoreWithTfIdf(text) {
  if (!text || text.trim().length < 15) {
    return {
      label: 'Inconclusive',
      probability: 0.0,
      confidence: 0.0,
      method: 'TF-IDF Classifier',
      top_indicators: []
    };
  }

  const sentences = text.split(/[.;\n]+/);
  let logOdds = BASE_BIAS;
  const matched = [];

  for (const sentence of sentences) {
    const isNegatedSentence = NEGATION_REGEX.test(sentence);
    const ngrams = extractNGrams(sentence);
    const counts = {};

    for (const gram of ngrams) {
      counts[gram] = (counts[gram] || 0) + 1;
    }

    for (const [term, count] of Object.entries(counts)) {
      if (VOCABULARY_WEIGHTS.hasOwnProperty(term)) {
        let weight = VOCABULARY_WEIGHTS[term];

        if (isNegatedSentence && weight > 0) {
          weight = -0.5 * weight;
        }

        const tf = 1 + Math.log(count);
        logOdds += weight * tf;

        if (weight > 0.4) {
          matched.push({ term, weight, count });
        }
      }
    }
  }

  const probability = 1 / (1 + Math.exp(-logOdds));

  matched.sort((a, b) => (b.weight * b.count) - (a.weight * a.count));
  const topIndicators = matched.slice(0, 5).map(m => m.term);

  const confidence = Math.min(1.0, Math.max(0.5, Math.abs(probability - 0.5) * 2));

  let label = 'Likely Authentic';
  if (probability >= 0.65) {
    label = 'Suspicious';
  } else if (probability >= 0.40) {
    label = 'Caution Advised';
  }

  return {
    label,
    probability: Math.round(probability * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    method: 'TF-IDF Classifier',
    top_indicators: topIndicators
  };
}
