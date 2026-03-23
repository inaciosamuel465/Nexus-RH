import { Router } from 'express';
import { login, register } from './controller.js';

export const router = Router();

// Endpoints públicos de Auth (SEM middleware protegido)
router.post('/login', login);
router.post('/register', register);

export default router;
