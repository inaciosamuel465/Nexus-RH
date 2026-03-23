import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { logger } from '../../core/logger.js';
import { skillService } from '../../services/SkillService.js';
import { EmployeeModel } from '../../models/Employee.js';

export const getEmployeeData = async (req: AuthRequest, res: Response) => {
  const targetUserId = req.params.id;
  const requestUser = req.user;

  // PRIVACY GUARD: Colaborador só acessa o próprio ID
  if (requestUser?.role === 'COLABORADOR' && requestUser.userId !== targetUserId) {
    logger.warn(`Tentativa de violação de privacidade: ${requestUser.userId} tentou acessar ${targetUserId}`);
    return res.status(403).json({ error: 'Acesso Negado: Você só pode visualizar seus próprios dados.' });
  }

  try {
    const employee = await EmployeeModel.findOne({ 
      userId: targetUserId, 
      tenantId: requestUser?.tenantId 
    }).populate('sectorId');
    
    if (!employee) return res.status(404).json({ error: 'Colaborador não localizado.' });
    res.json({ success: true, data: employee });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const predictTurnover = async (req: AuthRequest, res: Response) => {
  try {
     const employee = await EmployeeModel.findOne({ 
       userId: req.body.userId, 
       tenantId: req.user?.tenantId 
     });
     if (!employee) return res.status(404).json({ error: 'Colaborador não localizado.' });

     const result = await skillService.runSkill('turnoverPrediction', { 
       employeeData: employee 
     });

     // Persiste a predição no MongoDB
     employee.turnoverRisk = result.riskScore;
     await employee.save();

     res.json({ success: true, turnoverForecast: result });
  } catch (err: any) {
     logger.error('Erro no controller prever turnover:', err);
     res.status(500).json({ error: err.message });
  }
};
