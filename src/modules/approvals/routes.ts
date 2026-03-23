import { Router } from 'express';
import { authMiddleware, requireRoles } from '../../core/authMiddleware.js';
import { createRequest, listPendingForLider, approveRequest } from './controller.js';

export const router = Router();

// Seguradora global
router.use(authMiddleware);

// ============================================
// HIERARQUIA 1: COLABORADORES
// ============================================
// Qualquer colaborador logado (ou lider, etc.) pode submeter uma petição para seu gerente imediato.
router.post('/request', requireRoles(['COLABORADOR', 'LIDER']), createRequest);

// ============================================
// HIERARQUIA 2: LÍDERES & ADMINS
// ============================================
// Somente líderes enxergam a rota que devolve a mesa de trabalho de aprovações atrelada ao ID deles
router.get('/pending', requireRoles(['LIDER']), listPendingForLider);

// Os líderes utilizam a rota REST PUT para efetivar decisão de "APPROVED" ou "REJECTED" em cards de seus operadores
router.put('/:requestId/decide', requireRoles(['LIDER']), approveRequest);

export default router;
