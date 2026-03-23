import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { skillService } from '../../services/SkillService.js';

export const router = Router();
router.use(authMiddleware);

router.get('/kpis', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const tenantId = req.user?.tenantId;
    
    const totalEmpResult = await dbPool.query('SELECT COUNT(*) FROM employees WHERE tenant_id = $1', [tenantId]);
    const avgSalaryResult = await dbPool.query('SELECT AVG(salary) FROM employees WHERE tenant_id = $1', [tenantId]);
    const openJobsResult = await dbPool.query('SELECT COUNT(*) FROM jobs WHERE tenant_id = $1 AND status = $2', [tenantId, 'Open']);
    const openTicketsResult = await dbPool.query('SELECT COUNT(*) FROM tickets WHERE tenant_id = $1 AND status = $2', [tenantId, 'Aberto']);

    res.json({
      success: true,
      data: {
        totalEmployees: parseInt(totalEmpResult.rows[0].count),
        averageSalary: parseFloat(avgSalaryResult.rows[0].avg || 0),
        openJobs: parseInt(openJobsResult.rows[0].count),
        openTickets: parseInt(openTicketsResult.rows[0].count),
        turnoverRate: 2.5, // Mock por enquanto
        employeeSatisfaction: 85
      }
    });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.post('/ai-insights', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const tenantId = req.user?.tenantId;
    const employees = await dbPool.query('SELECT * FROM employees WHERE tenant_id = $1', [tenantId]);
    
    const insights = await skillService.runSkill('employeeAnalytics', {
       employeeData: employees.rows,
       companyContext: 'Indústria Metalúrgica Pesada Nexus.'
    });

    res.json({ success: true, data: insights });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

export default router;
