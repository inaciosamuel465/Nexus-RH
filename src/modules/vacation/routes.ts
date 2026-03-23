import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const tenantId = req.user?.tenantId;
    let query = 'SELECT v.*, e.name as employee_name FROM vacations v JOIN employees e ON v.employee_id = e.id WHERE v.tenant_id = $1';
    const params = [tenantId];
    if (req.user?.role === 'COLABORADOR') {
       query += ' AND v.employee_id = $2';
       params.push(req.user.userId);
    }
    const result = await dbPool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { employeeId, startDate, endDate, days, type, sellTenDays } = req.body;
    const result = await dbPool.query(
      `INSERT INTO vacations (tenant_id, employee_id, start_date, end_date, days, type, sell_ten_days, status, request_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [req.user?.tenantId, employeeId || req.user?.userId, startDate, endDate, days, type, sellTenDays, 'Pendente']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/approve', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('UPDATE vacations SET status = $1 WHERE id = $2 RETURNING *', ['Aprovado', req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.put('/:id/reject', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('UPDATE vacations SET status = $1 WHERE id = $2 RETURNING *', ['Rejeitado', req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
