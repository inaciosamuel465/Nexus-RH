import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

// HEALTH
router.get('/health', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT h.*, e.name as employee_name FROM health_records h JOIN employees e ON h.employee_id = e.id WHERE h.tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/health', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { employeeId, type, date, status, next_exam, doctor_name, notes } = req.body;
    const result = await dbPool.query(
      `INSERT INTO health_records (tenant_id, employee_id, type, date, status, next_exam, doctor_name, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user?.tenantId, employeeId, type, date, status, next_exam, doctor_name, notes]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// CERTIFICATES
router.get('/certificates', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT c.*, e.name as employee_name FROM medical_certificates c JOIN employees e ON c.employee_id = e.id WHERE c.tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/certificates', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { employeeId, start_date, end_date, days, reason, doctor_name, crm, abono_horas } = req.body;
    const result = await dbPool.query(
      `INSERT INTO medical_certificates (tenant_id, employee_id, start_date, end_date, days, reason, doctor_name, crm, abono_horas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user?.tenantId, employeeId, start_date, end_date, days, reason, doctor_name, crm, abono_horas]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
