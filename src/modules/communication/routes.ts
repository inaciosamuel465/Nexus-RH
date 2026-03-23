import { Router } from 'express';
import { authMiddleware } from '../../core/authMiddleware.js';
import { sendInternalNotice, chatMessage } from './controller.js';

export const router = Router();

router.use(authMiddleware);

router.post('/notice', sendInternalNotice);
router.post('/chat', chatMessage);

export default router;
