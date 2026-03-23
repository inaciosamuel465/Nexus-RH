import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT * FROM benefits WHERE tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', requireRoles(['ADMIN']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { name, provider, type, base_cost, eligibility, description } = req.body;
    const result = await dbPool.query(
      `INSERT INTO benefits (tenant_id, name, provider, type, base_cost, eligibility, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user?.tenantId, name, provider, type, base_cost, eligibility, description]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/enroll', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { benefitId, employeeId, cardNumber } = req.body;
    const result = await dbPool.query(
      `INSERT INTO employee_benefits (tenant_id, employee_id, benefit_id, status, enrollment_date, card_number)
       VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *`,
      [req.user?.tenantId, employeeId || req.user?.userId, benefitId, 'Ativo', cardNumber]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
