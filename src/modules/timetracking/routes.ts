import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

// LIST
router.get('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const tenantId = req.user?.tenantId;
    const { employeeId, date } = req.query;
    let query = 'SELECT t.*, e.name as employee_name FROM time_records t JOIN employees e ON t.employee_id = e.id WHERE t.tenant_id = $1';
    const params = [tenantId];
    let i = 2;
    if (employeeId) { query += ` AND t.employee_id = $${i}`; params.push(employeeId as string); i++; }
    if (date) { query += ` AND t.date = $${i}`; params.push(date as string); i++; }

    query += ' ORDER BY t.created_at DESC LIMIT 200';
    const result = await dbPool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// PUNCH
router.post('/punch', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { type, location, employeeId } = req.body;
    const targetId = employeeId || req.user?.userId;
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toLocaleTimeString('pt-BR');

    const result = await dbPool.query(
      `INSERT INTO time_records (tenant_id, employee_id, date, type, timestamp, status, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user?.tenantId, targetId, date, type, timestamp, 'Original', location]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ADJUST
router.put('/:id/adjust', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { type, date, timestamp, justification } = req.body;
    const result = await dbPool.query(
      `UPDATE time_records SET type = $1, date = $2, timestamp = $3, justification = $4, status = $5
       WHERE id = $6 RETURNING *`,
      [type, date, timestamp, justification, 'Pendente', req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// APPROVE
router.put('/:id/approve', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('UPDATE time_records SET status = $1 WHERE id = $2 RETURNING *', ['Ajustado', req.params.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
