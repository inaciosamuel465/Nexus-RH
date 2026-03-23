import { ISkill, SkillConfig } from './ISkill';
import { logger } from '../core/logger.js';

export default class ChatSkill implements ISkill {
  config: SkillConfig = { name: 'chat', description: 'Bot de conversação de suporte ao colaborador em tempo real', version: '1.0', category: 'Communication' };
  async execute(payload: any): Promise<any> {
    return { success: true, reply: 'Olá! Como posso ajudar você a navegar as férias hoje?' };
  }
}
