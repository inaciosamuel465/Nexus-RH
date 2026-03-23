import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    tenantId: string;
    role: string;
  };
  body: any;
  params: any;
  query: any;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Bloqueado: Token ausente na rota: ${req.originalUrl}`);
    res.status(401).json({ success: false, error: 'Acesso Negado: Token Ausente' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'nexus_super_secret_key');
    (req as AuthRequest).user = payload as any;
    next();
  } catch (err) {
    logger.error('Decodificação falhou JWT:', err);
    res.status(403).json({ success: false, error: 'Token JWT Inválido ou Expirado' });
    return;
  }
};

export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    
    if (!user || (!allowedRoles.includes(user.role) && user.role !== 'ADMIN')) {
       logger.warn(`Acesso Negado (RBAC) na rota ${req.originalUrl}. Role requerida: ${allowedRoles.join(', ')} | Fornecida: ${user?.role}`);
       res.status(403).json({ success: false, error: 'Acesso Negado: Privilégios hierárquicos insuficientes.' });
       return;
    }
    
    next();
  };
};
