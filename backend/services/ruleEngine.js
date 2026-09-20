const NEGATION_PATTERNS = [
  /never\s+(?:ask|charge|request|solicit|demand|require)\b/i,
  /does\s+not\s+(?:ask|charge|request|solicit|demand|require)\b/i,
  /do\s+not\s+(?:pay|transfer|send|entertain|fall|deposit)\b/i,
  /no\s+(?:fees?|charges?|deposit|amount|cost)\b/i,
  /without\s+any\s+(?:fees?|charges?|deposit)\b/i,
  /free\s+of\s+cost\b/i,
  /beware\s+of\s+(?:fraud|fake|scam|unauthorized)\b/i,
  /official\s+partners\s+never\b/i
];

function isNegated(text, matchStart, matchEnd) {
  const windowStart = Math.max(0, matchStart - 70);
  const windowEnd = Math.min(text.length, matchEnd + 30);
  const surroundingText = text.slice(windowStart, windowEnd);

  return NEGATION_PATTERNS.some(pattern => pattern.test(surroundingText));
}

const RULES = [
  {
    id: 'ADVANCE_PAYMENT_FEE',
    category: 'Advance Fee Demand',
    severity: 'CRITICAL',
    reason: 'Legitimate employers do not ask candidates to pay registration, training, uniform, or laptop fees.',
    patterns: [
      /pay\s+(?:rs\.?|inr|₹)?\s*\d+[\d,]*/gi,
      /(?:registration|processing|gate\s*pass|training|uniform|courier|laptop|software\s*license|security)\s*(?:fee|fees|charges?|deposit|amount|cost)/gi,
      /refundable\s+(?:security\s+)?deposit/gi,
      /deposit\s+(?:of\s+)?(?:rs\.?|inr|₹)?\s*\d+[\d,]*/gi,
      /one\s*time\s*joining\s*kit\s*fee/gi,
      /activation\s*fee/gi,
      /visa\s*processing\s*fee/gi
    ],
    respectNegation: true
  },
  {
    id: 'INFORMAL_PAYMENT_METHOD',
    category: 'Informal Payment Channel',
    severity: 'CRITICAL',
    reason: 'Demands for payment via UPI, Google Pay, PhonePe, or crypto are a strong indicator of a scam.',
    patterns: [
      /\b(?:gpay|google\s*pay|phonepe|paytm|upi\s*id|qr\s*code|crypto\s*wallet)\b/gi,
      /send\s+screenshot\s+of\s+payment/gi,
      /transfer\s+(?:rs\.?|inr|₹)?\s*\d+/gi
    ],
    respectNegation: true
  },
  {
    id: 'DIRECT_SELECTION_NO_INTERVIEW',
    category: 'No Interview Direct Selection',
    severity: 'HIGH',
    reason: 'Real companies evaluate skills or conduct interviews before offering a job.',
    patterns: [
      /no\s*interview\s*(?:required|needed|conducted)?/gi,
      /direct\s*(?:selection|joining|appointment|hiring)\b/gi,
      /without\s*(?:any\s*)?(?:interview|test|exam|screening)/gi,
      /offer\s*letter\s*will\s*be\s*(?:emailed|sent)\s*within\s*\d+\s*minutes/gi,
      /100%\s*(?:job\s*)?guarantee/gi
    ],
    respectNegation: false
  },
  {
    id: 'SUSPICIOUS_COMMUNICATION',
    category: 'Informal Messaging Channel',
    severity: 'HIGH',
    reason: 'Corporate recruiters communicate through official company email addresses, not personal WhatsApp or Telegram.',
    patterns: [
      /telegram\s*(?:group|channel|app)?\s*@?[\w_]+/gi,
      /@[\w_]{4,}\s+on\s+telegram/gi,
      /(?:contact|whatsapp|dm)\s*(?:hr\s*)?(?:on|at)?\s*\+?\d{10,12}/gi,
      /join\s+our\s*(?:official\s*)?telegram/gi,
      /whatsapp\s+us\s+at\s*\d+/gi
    ],
    respectNegation: false
  },
  {
    id: 'PRESSURE_URGENCY',
    category: 'Urgency Tactic',
    severity: 'MEDIUM',
    reason: 'Creating rush (e.g. within 2 hours, today only) pressures candidates to pay before checking facts.',
    patterns: [
      /within\s*\d+\s*(?:hours?|hrs?|minutes?|mins?)\b/gi,
      /hurry[!,]?\s*only\s*\d+\s*seats?\s*remaining/gi,
      /last\s*date\s*today/gi,
      /pay\s*today\s*to\s*confirm/gi,
      /limited\s*vacancies\b/gi
    ],
    respectNegation: false
  },
  {
    id: 'UNREALISTIC_EARNINGS',
    category: 'Unrealistic Pay Promise',
    severity: 'HIGH',
    reason: 'High pay for basic tasks like typing, liking videos, or captcha work is typical of task scams.',
    patterns: [
      /earn\s+(?:rs\.?|inr|₹)?\s*\d+[\d,]*\s*(?:daily|per\s*day|per\s*page|weekly)/gi,
      /liking\s*youtube\s*videos/gi,
      /copy\s*pasting\s*ads/gi,
      /earn\s*\d+%\s*commission\s*instantly/gi,
      /fill\s*simple\s*forms\s*and\s*earn/gi
    ],
    respectNegation: false
  },
  {
    id: 'SENSITIVE_IDENTITY_DATA',
    category: 'Premature Document Request',
    severity: 'MEDIUM',
    reason: 'Asking for PAN, Aadhaar, or bank details before a verified offer letter poses identity theft risks.',
    patterns: [
      /(?:send|submit)\s+your\s+aadhaar\s*(?:card)?\s*(?:and|&)\s*pan\s*(?:card)?/gi,
      /blank\s*cheque/gi,
      /bank\s*otp|atm\s*pin/gi
    ],
    respectNegation: true
  }
];

export function detectRuleViolations(text) {
  if (!text || typeof text !== 'string') return [];

  const evidenceSpans = [];
  const coveredRanges = [];

  const isOverlapping = (start, end) =>
    coveredRanges.some(([s, e]) => Math.max(start, s) < Math.min(end, e));

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      pattern.lastIndex = 0;
      let match;

      while ((match = pattern.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        const phrase = match[0];

        if (rule.respectNegation && isNegated(text, start, end)) {
          continue;
        }

        if (!isOverlapping(start, end)) {
          coveredRanges.push([start, end]);
          evidenceSpans.push({
            phrase,
            category: rule.category,
            reason: rule.reason,
            severity: rule.severity,
            start,
            end
          });
        }
      }
    }
  }

  return evidenceSpans.sort((a, b) => a.start - b.start);
}
