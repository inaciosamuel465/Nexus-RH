import { Router } from 'express';
import { authMiddleware } from '../../core/authMiddleware.js';
import { getDashboardKPIs, generateAIInsights } from './controller.js';

export const router = Router();

router.use(authMiddleware);

router.get('/kpis', getDashboardKPIs);
router.post('/ai-insights', generateAIInsights);

export default router;
