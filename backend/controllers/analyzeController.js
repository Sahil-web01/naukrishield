import { analyzeJobMessage } from '../services/analyzerService.js';
import { ScanReport } from '../models/ScanReport.js';
import { getDBStatus, getDBInfo } from '../config/db.js';

export const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Please provide text in the request body.'
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        error: 'Message cannot be empty.'
      });
    }

    const result = analyzeJobMessage(text);

    // Save scan to database if connected
    if (getDBStatus()) {
      try {
        await ScanReport.create({
          textSnippet: text.slice(0, 180) + (text.length > 180 ? '...' : ''),
          riskCategory: result.risk_category,
          riskScore: result.risk_score,
          modelAssessment: result.model_assessment,
          evidenceSpans: result.evidence_spans,
          nextSteps: result.next_steps,
          limitations: result.limitations,
          charCount: result.char_count,
          wordCount: result.word_count,
          analysisVersion: result.analysis_version
        });
      } catch (err) {
        console.error('Failed to save scan to database:', err.message);
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Error during analysis:', err);
    return res.status(500).json({
      error: 'Analysis failed. Please try again.'
    });
  }
};

export const getScanHistory = async (req, res) => {
  try {
    if (!getDBStatus()) {
      return res.status(200).json({ history: [] });
    }
    const reports = await ScanReport.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-__v');
    return res.status(200).json({ history: reports });
  } catch (err) {
    console.error('Failed to get history:', err);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const getScanStats = async (req, res) => {
  try {
    if (!getDBStatus()) {
      return res.status(200).json({
        total: 0,
        highRisk: 0,
        moderateRisk: 0,
        lowRisk: 0,
        dbConnected: false
      });
    }

    const [total, highRisk, moderateRisk, lowRisk] = await Promise.all([
      ScanReport.countDocuments(),
      ScanReport.countDocuments({ riskCategory: 'HIGH' }),
      ScanReport.countDocuments({ riskCategory: 'MODERATE' }),
      ScanReport.countDocuments({ riskCategory: 'LOW' })
    ]);

    return res.status(200).json({
      total,
      highRisk,
      moderateRisk,
      lowRisk,
      dbConnected: true
    });
  } catch (err) {
    console.error('Failed to get stats:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getHealth = (req, res) => {
  const info = getDBInfo();
  return res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    database: {
      connected: getDBStatus(),
      host: info.host,
      name: info.name,
      isCluster: Boolean(info.host && info.host.includes('mongodb.net'))
    },
    timestamp: new Date().toISOString()
  });
};
