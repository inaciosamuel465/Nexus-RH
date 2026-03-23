import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';

export const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT s.*, e.name as leader_name FROM sectors s LEFT JOIN employees e ON s.leader_id = e.id WHERE s.tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT s.*, e.name as leader_name FROM sectors s LEFT JOIN employees e ON s.leader_id = e.id WHERE s.id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Setor não encontrado.' });
    
    const sector = result.rows[0];
    // Pegar funcionários do setor
    const empResult = await dbPool.query('SELECT id, name, role FROM employees WHERE sector_id = $1', [req.params.id]);
    sector.employees = empResult.rows;

    res.json({ success: true, data: sector });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { name, leaderId, trainings, productivity } = req.body;
    const result = await dbPool.query(
      `INSERT INTO sectors (tenant_id, name, leader_id, trainings, productivity)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user?.tenantId, name, leaderId, trainings || [], productivity || 0]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
