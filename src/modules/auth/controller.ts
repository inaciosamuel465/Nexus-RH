import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbPool } from '../../core/database.js';
import { logger } from '../../core/logger.js';

export const register = async (req: Request, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Neon Banco não configurado' });
  const { name, email, password, role, managerId, tenantId } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const userRole = role || 'COLABORADOR';
    const userTenant = tenantId || 'nexus';

    const insertQuery = `
      INSERT INTO users (tenant_id, name, email, password_hash, role, manager_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role;
    `;
    const result = await dbPool.query(insertQuery, [userTenant, name, email, hash, userRole, managerId || null]);
    
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err: any) {
    logger.error('Erro no registro (E-mail duplicado?):', err);
    res.status(400).json({ error: 'Falha no registro corporativo. Verifique se o e-mail não recai em infração única.' });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!dbPool) return res.status(500).json({ error: 'Neon Banco inativo' });
  const { email, password } = req.body;

  try {
    const result = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) return res.status(401).json({ error: 'Credenciais inválidas de segurança' });

    // Payload embutinho Tenant e Role para a engine de Módulos (RBAC) ler
    const payload = {
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'nexus_super_secret_key', { expiresIn: '12h' });

    logger.info(`Login bem-sucedido para [${user.name}] em Tenant: [${user.tenant_id}] (Role: ${user.role})`);
    res.json({ success: true, token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err: any) {
    logger.error('Erro na camada de autenticação Neon:', err);
    res.status(500).json({ error: 'Falha interna na autenticação' });
  }
};
