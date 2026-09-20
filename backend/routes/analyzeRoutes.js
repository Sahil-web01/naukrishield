import { Router } from 'express';
import {
  analyzeText,
  getScanHistory,
  getScanStats,
  getHealth
} from '../controllers/analyzeController.js';

const router = Router();

router.post('/analyze', analyzeText);
router.get('/history', getScanHistory);
router.get('/stats', getScanStats);
router.get('/health', getHealth);

export default router;
