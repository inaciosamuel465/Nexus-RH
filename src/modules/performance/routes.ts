import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query(
      'SELECT p.*, e.name as employee_name FROM performance_evaluations p JOIN employees e ON p.employee_id = e.id WHERE p.tenant_id = $1',
      [req.user?.tenantId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { employeeId, period, performance_score, potential_score, competencies, goals, pdi, status } = req.body;
    const result = await dbPool.query(
      `INSERT INTO performance_evaluations (tenant_id, employee_id, evaluator_id, period, performance_score, potential_score, competencies, goals, pdi, status, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) RETURNING *`,
      [req.user?.tenantId, employeeId, req.user?.userId, period, performance_score, potential_score, JSON.stringify(competencies), JSON.stringify(goals), pdi, status]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
