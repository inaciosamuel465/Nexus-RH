import { Router } from 'express';
import { authMiddleware } from '../../core/authMiddleware.js';
import { getEmployeeData, predictTurnover } from './controller.js';

export const router = Router();

router.use(authMiddleware);

router.get('/:id', getEmployeeData);
router.post('/predict-turnover', predictTurnover);

export default router;
