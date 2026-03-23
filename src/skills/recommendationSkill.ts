import { ISkill, SkillConfig } from './ISkill';
import { logger } from '../core/logger';

export default class RecommendationSkill implements ISkill {
  config: SkillConfig = {
    name: 'recommendation',
    description: 'Analisa o comportamento do usuário para sugerir próximos exercícios / trilhas.',
    version: '1.0.0',
    category: 'Analysis'
  };

  async execute(payload: { userId: string, recentScores: number[], currentTheme: string }): Promise<any> {
    logger.info(`Gerando recomendação de trilha para usuario ${payload.userId}`);
    
    const avg = payload.recentScores.length > 0 
       ? payload.recentScores.reduce((a,b) => a+b, 0) / payload.recentScores.length 
       : 50;

    let suggestion = '';
    
    if (avg > 80) {
      suggestion = `Avançar para tópico mais completo de ${payload.currentTheme}.`;
    } else if (avg > 50) {
      suggestion = `Praticar mais exercícios intermediários de ${payload.currentTheme}.`;
    } else {
      suggestion = `Revisar conceitos base de ${payload.currentTheme}.`;
    }

    return {
      userId: payload.userId,
      averageScore: avg,
      recommendation: suggestion
    };
  }
}
