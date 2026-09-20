import mongoose from 'mongoose';

const evidenceSpanSchema = new mongoose.Schema({
  phrase: { type: String, required: true },
  category: { type: String, required: true },
  reason: { type: String, required: true },
  severity: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'INFO'], required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true }
}, { _id: false });

const scanReportSchema = new mongoose.Schema({
  textSnippet: { type: String, required: true },
  riskCategory: {
    type: String,
    enum: ['HIGH', 'MODERATE', 'LOW', 'INSUFFICIENT_INFO'],
    required: true
  },
  riskScore: { type: Number, required: true },
  modelAssessment: {
    label: String,
    probability: Number,
    confidence: Number,
    method: String,
    top_indicators: [String]
  },
  evidenceSpans: [evidenceSpanSchema],
  nextSteps: [String],
  limitations: [String],
  charCount: Number,
  wordCount: Number,
  analysisVersion: { type: String, default: '1.0.0' },
  createdAt: { type: Date, default: Date.now }
});

export const ScanReport = mongoose.model('ScanReport', scanReportSchema);
