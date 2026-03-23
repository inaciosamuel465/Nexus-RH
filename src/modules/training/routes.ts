import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT * FROM trainings WHERE tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { name, category, duration_hours, instructor, is_mandatory, target_departments } = req.body;
    const result = await dbPool.query(
      `INSERT INTO trainings (tenant_id, name, category, duration_hours, instructor, is_mandatory, target_departments)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user?.tenantId, name, category, duration_hours, instructor, is_mandatory, target_departments || []]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/assign', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { trainingId, employeeId } = req.body;
    const result = await dbPool.query(
      `INSERT INTO employee_trainings (tenant_id, employee_id, training_id, status, assigned_by, assigned_date)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [req.user?.tenantId, employeeId, trainingId, 'Pendente', req.user?.role]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
