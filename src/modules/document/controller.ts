import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { skillService } from '../../services/SkillService.js';
import { logger } from '../../core/logger.js';
import { TemplateEngine } from '../../core/templateEngine.js';

export const generateContract = async (req: AuthRequest, res: Response) => {
  const { employeeName, salary, position } = req.body;
  
  try {
    const document = await skillService.runSkill('documentGenerator', {
      documentType: 'Contrato de Trabalho (SaaS Standard)',
      variables: { employeeName, salary, position, company: req.user?.tenantId }
    });

    res.json({ success: true, document });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const generateWarning = async (req: AuthRequest, res: Response) => {
  try {
     const document = await skillService.runSkill('documentGenerator', {
       documentType: 'Advertência Formal',
       variables: { ...req.body, date: new Date() }
     });
     res.json({ success: true, document });
  } catch (err: any) {
     res.status(500).json({ error: err.message });
  }
};

export const previewDocument = async (req: AuthRequest, res: Response) => {
  const { type, content, employeeName } = req.body;
  try {
    const html = TemplateEngine.renderDocument(type, content, { employeeName });
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err: any) {
    res.status(500).send('Erro ao gerar preview do documento.');
  }
};
