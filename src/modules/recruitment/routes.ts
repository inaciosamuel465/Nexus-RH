import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { skillService } from '../../services/SkillService.js';
import { logger } from '../../core/logger.js';

export const router = Router();
router.use(authMiddleware);

// LIST JOBS
router.get('/jobs', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT * FROM jobs WHERE tenant_id = $1', [req.user?.tenantId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// LIST CANDIDATES
router.get('/candidates', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const jobId = req.query.jobId;
    let query = 'SELECT * FROM candidates WHERE tenant_id = $1';
    const params = [req.user?.tenantId];
    if (jobId) { query += ' AND job_id = $2'; params.push(jobId as string); }
    
    const result = await dbPool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// APPLY / UPDATE CANDIDATE
router.post('/apply', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { name, email, phone, appliedRole, cvText, jobId } = req.body;
    const result = await dbPool.query(
      `INSERT INTO candidates (tenant_id, name, email, phone, applied_role, cv_text, job_id, stage, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.user?.tenantId, name, email, phone, appliedRole, cvText, jobId, 'Triagem', 'Pendente']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ANALYZE CV (AI)
router.post('/analyze-cv', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { candidateId } = req.body;
    const candRes = await dbPool.query('SELECT * FROM candidates WHERE id = $1', [candidateId]);
    if (candRes.rows.length === 0) return res.status(404).json({ error: 'Candidato não encontrado.' });
    
    const candidate = candRes.rows[0];
    const analysis = await skillService.runSkill('cvAnalyzer', {
      cvText: candidate.cv_text,
      jobDescription: 'Vaga solicitada no sistema.'
    });

    const updateQuery = `
      UPDATE candidates 
      SET ai_analysis = $1, ai_score = $2, cv_summary = $3, score = $2, stage = $4 
      WHERE id = $5 RETURNING *;
    `;
    const result = await dbPool.query(updateQuery, [
      JSON.stringify(analysis),
      analysis.score || 0,
      analysis.summary,
      analysis.score > 70 ? 'Entrevista Técnica' : 'Triagem',
      candidateId
    ]);

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { 
    logger.error('Error in AI CV analysis:', err);
    res.status(500).json({ error: err.message }); 
  }
});

export default router;
