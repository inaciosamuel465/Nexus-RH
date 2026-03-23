import { Response } from 'express';
import { AuthRequest } from '../../core/authMiddleware.js';
import { logger } from '../../core/logger.js';
import { skillService } from '../../services/SkillService.js';
import { CandidateModel } from '../../models/Candidate.js';
import { TemplateEngine } from '../../core/templateEngine.js';

export const listJobs = async (req: AuthRequest, res: Response) => {
  res.json({ success: true, message: `Consultando vagas da organização [${req.user?.tenantId}]` });
};

export const applyJob = async (req: AuthRequest, res: Response) => {
  const { name, email, role } = req.body;
  const tenantId = req.user?.tenantId || 'default';

  try {
    const candidate = new CandidateModel({
      tenantId,
      name,
      email,
      appliedRole: role
    });
    await candidate.save();
    res.json({ success: true, message: 'Candidatura registrada no MongoDB.', candidateId: candidate._id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const analyzeCV = async (req: AuthRequest, res: Response) => {
  const { candidateId, cvText } = req.body;
  
  try {
     const candidate = await CandidateModel.findById(candidateId);
     if (!candidate) return res.status(404).json({ error: 'Candidato não encontrado.' });

     logger.info(`Módulo Recrutamento: Analisando CV de ${candidate.name}...`);
     
     const result = await skillService.runSkill('cvAnalyzer', { 
       cvText, 
       jobDescription: candidate.appliedRole 
     });

     // Atualiza no MongoDB com a análise real da IA
     candidate.cvSummary = result.summary;
     candidate.aiScore = result.score;
     candidate.aiAnalysis = result;
     candidate.status = 'Analisado';
     await candidate.save();

     res.json({ success: true, result });
  } catch (err: any) {
     logger.error('Erro no controller analisar currículo:', err);
     res.status(500).json({ success: false, error: err.message });
  }
};

export const renderCV = async (req: AuthRequest, res: Response) => {
  try {
    const candidate = await CandidateModel.findById(req.params.id);
    if (!candidate) return res.status(404).send('Candidato não encontrado.');

    const html = TemplateEngine.renderCV(candidate);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err: any) {
    res.status(500).send('Erro ao renderizar currículo.');
  }
};
