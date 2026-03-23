import { SkillManager } from './SkillManager.js';
import { ModuleManager } from './ModuleManager.js';
import express from 'express';
import { logger } from './logger.js';
import { connectMongo } from './mongoDatabase.js';
import { dbPool } from './database.js';

async function runTests() {
  logger.info('--- INICIANDO SUÍTE DE TESTES AUTOMATIZADA ---');
  let errors = 0;

  logger.info('>> TESTE 1: Conectividade Base (Banco Duplo)');
  
  // Teste Mongo
  try {
     await connectMongo();
  } catch(e) {
     logger.error('MongoDb falhou', e);
     errors++;
  }

  // Teste Postgres (Neon)
  try {
     if(dbPool) {
        const res = await dbPool.query('SELECT 1 as test');
        if(res.rows[0].test === 1) logger.info('PostgreSQL (Neon) em conexão perfeita com a pool ativa.');
     } else {
        logger.error('NeonDB Pool inativo. Cheque DATABASE_URL.');
        errors++;
     }
  } catch(e) {
     logger.error('NeonDB falhou as transaçoes base:', e);
     errors++;
  }

  logger.info('>> TESTE 2: Loading de Arquiteturas AI (Skill Factory)');
  const skillManager = new SkillManager();
  try {
    await skillManager.loadSkills();
    const skills = skillManager.getAllSkills();
    if(skills.length !== 17) {
       logger.error(`ATENÇÃO: Mismatch na injeção. Esperadas 17 skills, detectadas: ${skills.length}`);
       errors++;
    } else {
       logger.info('Excelente! Todas as 17 Skills foram lidas e instanciadas pelo SkillManager.');
    }
    
    logger.info('>> TESTE 3: Disparo Assíncrono de Skill (AIGenerator vs Fake Input)');
    // Testaremos a skill cvAnalyzer para simular a extraçao LLM
    const cvResult = await skillManager.executeSkill('cvAnalyzer', { dummyText: 'Testando' });
    if(cvResult && cvResult.parsedData) {
       logger.info('A Skill de IA (cvAnalyzer) processou assincronamente os dados via Promise com sucesso!');
    } else {
       logger.error('A resposta da Skill não possuía a assinatura de parse esperada.');
       errors++;
    }

  } catch(e) {
    logger.error('Falha geral no motor de Skills (Factory):', e);
    errors++;
  }

  logger.info('>> TESTE 4: Carregamento do Model-View-Controller (ModuleManager)');
  const testApp = express();
  const moduleManager = new ModuleManager(testApp);
  try {
    await moduleManager.loadModules();
    logger.info(`Teste isolado confirmou que ModuleManager consegue injetar o Express Router em rotas dinâmicas.`);
  } catch(e) {
    logger.error('Erro na subida de rotas MVC', e);
    errors++;
  }

  logger.info(`--- SUÍTE COMPLETA REALIZADA. TOTAL ERROS: ${errors} ---`);
  
  if (errors > 0) {
      process.exit(1);
  } else {
      process.exit(0);
  }
}

runTests();
