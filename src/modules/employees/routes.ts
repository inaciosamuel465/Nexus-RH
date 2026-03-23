import { Router, Response } from 'express';
import { authMiddleware, requireRoles, AuthRequest } from '../../core/authMiddleware.js';
import { dbPool } from '../../core/database.js';
import { logger } from '../../core/logger.js';

export const router = Router();
router.use(authMiddleware);

// LIST ALL (Admin/Líder)
router.get('/', requireRoles(['ADMIN', 'LIDER']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const result = await dbPool.query(
      `SELECT e.*, s.name as sector_name 
       FROM employees e 
       LEFT JOIN sectors s ON e.sector_id = s.id 
       WHERE e.tenant_id = $1`,
      [req.user?.tenantId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err: any) { 
    logger.error('Error listing employees:', err);
    res.status(500).json({ error: err.message }); 
  }
});

// GET BY ID (Com Detalhes: Dependentes e Histórico)
router.get('/:id', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const empId = req.params.id;
    const empResult = await dbPool.query(
      `SELECT e.*, s.name as sector_name 
       FROM employees e 
       LEFT JOIN sectors s ON e.sector_id = s.id 
       WHERE e.id = $1`,
      [empId]
    );

    if (empResult.rows.length === 0) return res.status(404).json({ error: 'Colaborador não encontrado.' });
    const emp = empResult.rows[0];

    // Privacy Guard
    if (req.user?.role === 'COLABORADOR' && emp.user_id?.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Buscar Dependentes
    const depResult = await dbPool.query('SELECT * FROM dependents WHERE employee_id = $1', [empId]);
    emp.dependents = depResult.rows;

    // Buscar Histórico
    const histResult = await dbPool.query('SELECT * FROM employee_history WHERE employee_id = $1 ORDER BY date DESC', [empId]);
    emp.history = histResult.rows;

    res.json({ success: true, data: emp });
  } catch (err: any) { 
    logger.error('Error getting employee details:', err);
    res.status(500).json({ error: err.message }); 
  }
});

// CREATE (Admin)
router.post('/', requireRoles(['ADMIN']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const { name, role, department, salary, hire_date, email, cpf, phone } = req.body;
    const tenantId = req.user?.tenantId;

    // Gerar Matrícula Simples
    const countRes = await dbPool.query('SELECT COUNT(*) FROM employees WHERE tenant_id = $1', [tenantId]);
    const registration = `NX${String(parseInt(countRes.rows[0].count) + 1).padStart(3, '0')}`;

    const insertQuery = `
      INSERT INTO employees (tenant_id, registration, name, role, department, salary, hire_date, email, cpf, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const result = await dbPool.query(insertQuery, [tenantId, registration, name, role, department, salary, hire_date || new Date(), email, cpf, phone]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { 
    logger.error('Error creating employee:', err);
    res.status(500).json({ error: err.message }); 
  }
});

// UPDATE
router.put('/:id', async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    const empId = req.params.id;
    const checkRes = await dbPool.query('SELECT * FROM employees WHERE id = $1', [empId]);
    if (checkRes.rows.length === 0) return res.status(404).json({ error: 'Não encontrado.' });
    
    const emp = checkRes.rows[0];
    if (req.user?.role === 'COLABORADOR' && emp.user_id?.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    // Admin pode tudo, Colaborador só campos específicos
    const allowedFields = req.user?.role === 'ADMIN' 
      ? Object.keys(req.body) 
      : ['phone', 'address_street', 'address_city', 'address_state', 'address_zip', 'bank_name', 'bank_agency', 'bank_account', 'bank_pix'];

    const updates: string[] = [];
    const values: any[] = [];
    let i = 1;

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${i}`);
        values.push(req.body[field]);
        i++;
      }
    });

    if (updates.length === 0) return res.json({ success: true, data: emp });

    values.push(empId);
    const updateQuery = `UPDATE employees SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`;
    const result = await dbPool.query(updateQuery, values);

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) { 
    logger.error('Error updating employee:', err);
    res.status(500).json({ error: err.message }); 
  }
});

// DELETE
router.delete('/:id', requireRoles(['ADMIN']), async (req: AuthRequest, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Database connection not available' });
  try {
    await dbPool.query('DELETE FROM employees WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Removido com sucesso.' });
  } catch (err: any) { 
    res.status(500).json({ error: err.message }); 
  }
});

export default router;
