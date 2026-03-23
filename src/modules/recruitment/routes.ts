import { Router } from 'express';
import { authMiddleware } from '../../core/authMiddleware.js';
import { listJobs, applyJob, analyzeCV, renderCV } from './controller.js';

export const router = Router();

// Protegendo o módulo inteiro SaaS (Multi-Tenant)
router.use(authMiddleware);

router.get('/jobs', listJobs);
router.post('/apply', applyJob);
router.post('/analyze-cv', analyzeCV);
router.get('/render-cv/:id', renderCV);

export default router;
