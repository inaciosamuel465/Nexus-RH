import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../core/authMiddleware.js';
import { listSectors, getSectorStats, createSector } from './controller.js';

export const router = Router();

router.use(authMiddleware);

// Apenas Admins e Líderes gerenciam setores
router.get('/', requireRoles(['ADMIN', 'LIDER']), listSectors);
router.get('/:id', requireRoles(['ADMIN', 'LIDER']), getSectorStats);
router.post('/', requireRoles(['ADMIN']), createSector);

export default router;
