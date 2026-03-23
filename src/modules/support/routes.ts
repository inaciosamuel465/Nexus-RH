import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { skillService } from '../../services/SkillService.js';

export const router = Router();
router.use(authMiddleware);

router.get('/tickets', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT t.*, e.name as requester_name FROM tickets t LEFT JOIN employees e ON t.requester_id = e.id WHERE t.tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/tickets', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { subject, description } = req.body;
    
    // IA Analisar Ticket
    const analysis = await skillService.runSkill('supportTicket', { description });

    const result = await dbPool.query(
      `INSERT INTO tickets (tenant_id, requester_id, subject, description, priority, category, ai_resolution, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        req.user?.tenantId,
        req.user?.userId,
        subject,
        description,
        analysis.priority,
        analysis.category,
        analysis.aiResolution,
        'Aberto'
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
