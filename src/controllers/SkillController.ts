import { Request, Response } from 'express';
import { skillService } from '../services/SkillService.js';
import { logger } from '../core/logger.js';

export class SkillController {
  
  public static async listSkills(req: Request, res: Response): Promise<void> {
    try {
      const skills = skillService.getAvailableSkills();
      res.json({ success: true, count: skills.length, skills });
    } catch (err: any) {
      logger.error('Erro ao listar skills:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static async executeSkill(req: Request, res: Response): Promise<void> {
    const { skillName } = req.params;
    const body = req.body;

    try {
      logger.info(`Requisição REST recebida para invocar skill [${skillName}]`);
      const result = await skillService.runSkill(skillName, body);
      res.json({ success: true, result });
    } catch (err: any) {
      logger.error(`Erro ao processar chamada REST para ${skillName}:`, err);
      res.status(500).json({ success: false, error: err.message || 'Erro interno na skill' });
    }
  }
}
