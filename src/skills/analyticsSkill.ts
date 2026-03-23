import { ISkill, SkillConfig } from './ISkill';
import { logger } from '../core/logger';

export default class AnalyticsSkill implements ISkill {
  config: SkillConfig = {
    name: 'analytics',
    description: 'Mede o uso do sistema, engajamento e tempos de resposta.',
    version: '1.0.0',
    category: 'Metrics'
  };

  private metrics: Array<{ event: string, timestamp: number, value: number, userId?: string }> = [];

  async initialize() {
     logger.info('AnalyticsSkill escutando a eventos de telemetria.');
  }

  async execute(payload: { event: string, value: number, userId?: string }): Promise<any> {
    if (!payload.event) throw new Error("A skill analytics demanda reportar qual evento ocorreu (payload.event).");

    this.metrics.push({
      event: payload.event,
      value: payload.value,
      userId: payload.userId,
      timestamp: Date.now()
    });

    const rtEvents = this.metrics.filter(m => m.event === 'response_time');
    const averageResponseTime = rtEvents.length > 0 
      ? rtEvents.reduce((sum, curr) => sum + curr.value, 0) / rtEvents.length 
      : 0;

    logger.info(`Evento registrado: ${payload.event}. [Média response_time: ${averageResponseTime.toFixed(2)}ms]`);

    return {
      success: true,
      totalEventsTracked: this.metrics.length,
      currentAverageResponseTime: averageResponseTime
    };
  }
}
