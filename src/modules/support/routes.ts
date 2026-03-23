import { Router } from 'express';
import { authMiddleware } from '../../core/authMiddleware.js';
import { createTicket, listTickets } from './controller.js';

export const router = Router();

router.use(authMiddleware);

router.post('/tickets', createTicket);
router.get('/tickets', listTickets);

export default router;
