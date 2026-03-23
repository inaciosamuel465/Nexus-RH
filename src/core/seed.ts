import { dbPool } from './database.js';
import { logger } from './logger.js';

async function seed() {
  if (!dbPool) {
    logger.error('Nenhum dbPool ativo. Verifique se o DATABASE_URL está no .env corretamente.');
    process.exit(1);
  }

  logger.info('Iniciando o Seed de Injeção de Dados Falsos no NeonDB (user_memory)...');

  try {
    // Cria tabela preventivamente caso as skills ainda não tenham instanciado
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS user_memory (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) DEFAULT 'system',
        context_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Massa de dados falsos de simulação para a IA "recomendar" ou aprender contextualmente
    const fakeData = [
      { user: 'joao_silva', data: { nivel: 'Iniciante', pontuacao: 85, ultimo_tema: 'TypeScript' } },
      { user: 'joao_silva', data: { feedback: 'Gênio! Desenvolve bem Node.', testeId: 'T-1029' } },
      { user: 'maria_oliveira', data: { nivel: 'Avançado', trilha: 'Machine Learning', pre_requisitos: 'Python' } },
      { user: 'system_default', data: { status_global: 'ONLINE', load: 12, ultima_revisao: '2026-03-22' } }
    ];

    logger.info(`Limpando tabela para evitar duplicatas infinitas de teste...`);
    await dbPool.query('DELETE FROM user_memory WHERE user_id IN (\'joao_silva\', \'maria_oliveira\', \'system_default\')');

    logger.info(`Inserindo ${fakeData.length} novos registros...`);
    for (const item of fakeData) {
      await dbPool.query(
        'INSERT INTO user_memory (user_id, context_data) VALUES ($1, $2)',
        [item.user, JSON.stringify(item.data)]
      );
    }

    logger.info('Seed Injetado com total Sucesso no Banco Remoto Neon!');
    
    // Retorno visual dos testes
    const testQuery = await dbPool.query('SELECT id, user_id, context_data FROM user_memory ORDER BY created_at DESC LIMIT 4;');
    console.log('\n--- Visualização da Tabela NeonDB ---');
    console.table(testQuery.rows);

    process.exit(0);
  } catch (err) {
    logger.error('Falha de transação SQL no Neon: ', err);
    process.exit(1);
  }
}

seed();
