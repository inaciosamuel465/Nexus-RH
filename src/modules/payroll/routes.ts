import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { logger } from '../../core/logger.js';

export const router = Router();
router.use(authMiddleware);

// Calcular tributos brasileiros
function calculateTaxes(salary: number) {
  let inss = 0;
  if (salary <= 1412) inss = salary * 0.075;
  else if (salary <= 2666.68) inss = (salary * 0.09) - 21.18;
  else if (salary <= 4000.03) inss = (salary * 0.12) - 101.18;
  else if (salary <= 7786.02) inss = (salary * 0.14) - 181.18;
  else inss = 908.85;

  const baseIRRF = salary - inss;
  let irrf = 0;
  if (baseIRRF <= 2112) irrf = 0;
  else if (baseIRRF <= 2826.65) irrf = (baseIRRF * 0.075) - 158.40;
  else if (baseIRRF <= 3751.05) irrf = (baseIRRF * 0.15) - 370.40;
  else if (baseIRRF <= 4664.68) irrf = (baseIRRF * 0.225) - 651.73;
  else irrf = (baseIRRF * 0.275) - 884.96;

  return { inss: Math.max(0, inss), irrf: Math.max(0, irrf), fgts: salary * 0.08 };
}

// LIST payrolls
router.get('/', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const tenantId = req.user?.tenantId;
    const month = req.query.month;
    let query = 'SELECT p.*, e.name as employee_name FROM payroll p JOIN employees e ON p.employee_id = e.id WHERE p.tenant_id = $1';
    const params = [tenantId];
    if (month) { query += ' AND p.month = $2'; params.push(month as string); }

    const result = await dbPool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// GET by employee
router.get('/employee/:empId', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query('SELECT * FROM payroll WHERE employee_id = $1 ORDER BY month DESC', [req.params.empId]);
    res.json({ success: true, data: result.rows });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// PROCESS payroll for month
router.post('/process', requireRoles(['ADMIN']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { month } = req.body;
    const tenantId = req.user?.tenantId;
    
    // Buscar todos os ativos
    const employees = await dbPool.query('SELECT id, name, salary FROM employees WHERE tenant_id = $1 AND status = $2', [tenantId, 'Ativo']);

    const results = [];
    for (const emp of employees.rows) {
      // Verifica se já processou
      const checkResult = await dbPool.query('SELECT id FROM payroll WHERE employee_id = $1 AND month = $2', [emp.id, month]);
      if (checkResult.rows.length > 0) {
        results.push(checkResult.rows[0]);
        continue;
      }

      const salary = parseFloat(emp.salary);
      const taxes = calculateTaxes(salary);
      const events = [
        { name: 'Salário Base', type: 'Provento', value: salary, origin: 'Sistema', reference: '30d' },
        { name: 'INSS', type: 'Desconto', value: taxes.inss, origin: 'Sistema' },
        { name: 'IRRF', type: 'Desconto', value: taxes.irrf, origin: 'Sistema' },
      ];
      const totalEarnings = salary;
      const totalDeductions = taxes.inss + taxes.irrf;

      const insertQuery = `
        INSERT INTO payroll (tenant_id, employee_id, month, gross_salary, net_salary, events, total_deductions, total_earnings, fgts_value, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `;
      const payrollRes = await dbPool.query(insertQuery, [
        tenantId, emp.id, month, totalEarnings, totalEarnings - totalDeductions,
        JSON.stringify(events), totalDeductions, totalEarnings, taxes.fgts, 'Processado'
      ]);
      results.push(payrollRes.rows[0]);
    }
    res.json({ success: true, data: results, message: `Folha processada para ${results.length} colaboradores.` });
  } catch (err: any) { 
    logger.error('Error processing payroll:', err);
    res.status(500).json({ error: err.message }); 
  }
});

export default router;
