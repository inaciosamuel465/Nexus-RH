import { ISkill, SkillConfig } from './ISkill';
import { logger } from '../core/logger';

export default class AdaptiveLearningSkill implements ISkill {
  config: SkillConfig = {
    name: 'adaptiveLearning',
    description: 'Ajusta a dificuldade das atividades com base em erros e acertos.',
    version: '1.0.0',
    category: 'Education'
  };

  async execute(payload: { currentDifficulty: string, mistakes: number, hits: number }): Promise<any> {
    logger.info(`Avaliando adaptabilidade do aprendizado (Acertos: ${payload.hits}, Erros: ${payload.mistakes})`);
    
    const levels = ['Iniciante', 'Intermediário', 'Avançado', 'Especialista'];
    let idx = levels.indexOf(payload.currentDifficulty);
    if (idx === -1) idx = 0;

    let newDifficulty = payload.currentDifficulty;
    let feedback = 'Mantenha o ritmo.';

    if (payload.hits > payload.mistakes * 2 && idx < levels.length - 1) {
      newDifficulty = levels[idx + 1];
      feedback = 'Bom trabalho! Elevando a dificuldade para maior desafio.';
    } else if (payload.mistakes > payload.hits && idx > 0) {
      newDifficulty = levels[idx - 1];
      feedback = 'Vamos focar na consolidação. Nível reduzido para absorção.';
    }

    return {
      oldDifficulty: payload.currentDifficulty,
      newDifficulty,
      feedback
    };
  }
}
