import { dbPool } from './database.js';
import bcrypt from 'bcryptjs';
import { logger } from './logger.js';

async function seedAuth() {
  if (!dbPool) {
    logger.error('Nenhum dbPool Neon ativo detectado no cluster.');
    process.exit(1);
  }

  logger.info('Sincronizando infraestrutura de Auth e Approvals na Nuvem (Neon DB)...');

  try {
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(50) DEFAULT 'nexus',
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'COLABORADOR',
        manager_id INT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS approval_requests (
        id SERIAL PRIMARY KEY,
        requester_id INT REFERENCES users(id),
        lider_id INT REFERENCES users(id),
        status VARCHAR(20) DEFAULT 'PENDING',
        type VARCHAR(50),
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Tabelas de Auth criadas e validadas severamente. Excluindo contas experimentais anteriores...');
    await dbPool.query('TRUNCATE users, approval_requests RESTART IDENTITY CASCADE;');

    // Mesma Hash bruta `123456` pra todos pra facilitar logar no dashboard
    const hash = await bcrypt.hash('123456', 10);

    logger.info('1) Setup: C-Level Supremo / Full Admin');
    const adminReq = await dbPool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ('CEO Administrativo', 'admin@nexus.com', $1, 'ADMIN') RETURNING id;
    `, [hash]);

    logger.info('2) Setup: Diretor de Squads da Empresa (Gestor liderança)');
    const liderReq = await dbPool.query(`
      INSERT INTO users (name, email, password_hash, role, manager_id) 
      VALUES ('Amanda Gestora', 'lider@nexus.com', $1, 'LIDER', $2) RETURNING id;
    `, [hash, adminReq.rows[0].id]);
    const liderId = liderReq.rows[0].id;

    logger.info('3) Setup: Associando chão de fábrica subordinados (Devs / Operadores)...');
    const colabReq1 = await dbPool.query(`
      INSERT INTO users (name, email, password_hash, role, manager_id) 
      VALUES ('Operador Junior do Call Center', 'op1@nexus.com', $1, 'COLABORADOR', $2) RETURNING id;
    `, [hash, liderId]);

    const colabReq2 = await dbPool.query(`
      INSERT INTO users (name, email, password_hash, role, manager_id) 
      VALUES ('Designer Pleno', 'op2@nexus.com', $1, 'COLABORADOR', $2) RETURNING id;
    `, [hash, liderId]);

    logger.info(`Simulando Inbox de Tarefas / Pendencias: Operador ${colabReq1.rows[0].id} pedindo adiantamento!`);
    await dbPool.query(`
      INSERT INTO approval_requests (requester_id, lider_id, status, type, details)
      VALUES ($1, $2, 'PENDING', 'ADIANTAR_DECIMO', '{"motivo": "Comprar computador home-office", "valor_desejado": "40%"}')
    `, [colabReq1.rows[0].id, liderId]);

    await dbPool.query(`
      INSERT INTO approval_requests (requester_id, lider_id, status, type, details)
      VALUES ($1, $2, 'PENDING', 'FERIAS', '{"data_inicio": "2026-10-12", "prazo": "20 dias corridos"}')
    `, [colabReq2.rows[0].id, liderId]);

    logger.info('----------------------------------------------');
    logger.info('Setup Neon Auth e Sistema Hierárquico RBAC Concluído 100% Online!');
    logger.info('----------------------------------------------');
    
    // Verificando as colunas no output
    const testQuery = await dbPool.query('SELECT id, name, email, role, manager_id FROM users;');
    console.table(testQuery.rows);

    process.exit(0);
  } catch(e) {
    logger.error('Database Sync fatal error no Master Node Schema:', e);
    process.exit(1);
  }
}

seedAuth();
