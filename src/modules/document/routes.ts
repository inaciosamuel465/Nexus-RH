import { Router } from 'express';
import { authMiddleware } from '../../core/authMiddleware.js';
import { generateContract, generateWarning, previewDocument } from './controller.js';

export const router = Router();

router.use(authMiddleware);

router.post('/generate-contract', generateContract);
router.post('/generate-warning', generateWarning);
router.post('/preview', previewDocument);

export default router;
