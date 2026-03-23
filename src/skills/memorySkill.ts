import { ISkill, SkillConfig } from './ISkill';
import { logger } from '../core/logger';
import { dbPool } from '../core/database';

export default class MemorySkill implements ISkill {
  config: SkillConfig = {
    name: 'memory',
    description: 'Integração com Neon Serverless para persistência de memória a longo prazo.',
    version: '2.0.0',
    category: 'Storage/Memory'
  };

  async initialize() {
    if (!dbPool) {
       logger.warn('MemorySkill iniciada mockada (DATABASE_URL vazio ou incorreto). Falhará ao rodar actions.');
       return;
    }

    try {
      logger.info('MemorySkill: Sincronizando schema user_memory no PostgreSQL remoto...');
      await dbPool.query(`
        CREATE TABLE IF NOT EXISTS user_memory (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) DEFAULT 'system',
          context_data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      logger.info('MemorySkill: NeonDB Database conectado e tabela conferida com sucesso.');
    } catch (err) {
      logger.error('Erro inesperado tentando migrar tabela user_memory:', err);
    }
  }

  async execute(payload: { action: 'store' | 'retrieve', data?: any, userId?: string }): Promise<any> {
    if (!dbPool) {
      throw new Error('O pool do NeonDB está desativado. Substitua o DATABASE_URL no seu .env.');
    }

    const userId = payload.userId || 'system_default';

    if (payload.action === 'store') {
      try {
        const query = `
          INSERT INTO user_memory (user_id, context_data)
          VALUES ($1, $2)
          RETURNING id;
        `;
        const values = [userId, JSON.stringify(payload.data || {})];
        const res = await dbPool.query(query, values);
        
        return { success: true, message: 'Processo armazenado de forma persistente no Neon.', recordId: res.rows[0].id };
      } catch (err: any) {
        logger.error('Falha de escrita no DB (Store):', err);
        throw new Error('Falha transacional ao inserir dados no PostgreSQL.');
      }
    } 
    
    if (payload.action === 'retrieve') {
      try {
        const query = `
          SELECT * FROM user_memory 
          WHERE user_id = $1 
          ORDER BY created_at DESC 
          LIMIT 25;
        `;
        const res = await dbPool.query(query, [userId]);
        return { success: true, history: res.rows };
      } catch (err: any) {
        logger.error('Falha de leitura no DB (Retrieve):', err);
        throw new Error('Falha no resgate dos vetores pela conexão remoto remota.');
      }
    }
    
    throw new Error('Memory action provider. Insira "store" ou "retrieve".');
  }
}
