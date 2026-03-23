import { dbPool } from './database.js';
import { logger } from './logger.js';

async function seedMegaNeon() {
  if (!dbPool) {
    logger.error('Erro: dbPool (Neon) não está ativo. Configure a connection string no .env');
    process.exit(1);
  }

  logger.info('Conectando ao NeonDB (PostgreSQL) para injetar o ecossistema completo de IA...');

  try {
    /* =======================================
       1. CRIAÇÃO DAS TABELAS (SCHEMAS)
       ======================================= */
    
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(50) DEFAULT 'nexus_corporate',
        name VARCHAR(150),
        role VARCHAR(100),
        turnover_risk INT, 
        engagement_score INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS candidates_ai_analysis (
        id SERIAL PRIMARY KEY,
        candidate_name VARCHAR(150),
        applied_role VARCHAR(100),
        cv_summary TEXT,
        ai_match_score INT,
        ai_generated_questions JSONB,
        ai_strengths JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS ai_assets (
        id SERIAL PRIMARY KEY,
        asset_type VARCHAR(50), -- IMAGE, DOCUMENT, NEWSLETTER, REPORT
        title VARCHAR(200),
        url TEXT,
        ai_prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id SERIAL PRIMARY KEY,
        user_name VARCHAR(150),
        issue TEXT,
        ai_resolution TEXT,
        priority VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info('Tabelas Globais do RH e GenAI validadas no NeonDB. Resetando registros...');
    
    // Deleta os dados antigos para o seed sempre inserir novidades frescas sem poluir
    await dbPool.query('TRUNCATE employees, candidates_ai_analysis, ai_assets, support_tickets RESTART IDENTITY CASCADE;');

    /* =======================================
       2. INJEÇÃO DOS DADOS SIMULADOS (MOCKS)
       ======================================= */
       
    logger.info('Populando [Employees] (Turnover Prediction e Engagement)...');
    await dbPool.query(`
      INSERT INTO employees (name, role, turnover_risk, engagement_score) VALUES 
      ('Carlos Souza', 'Engenheiro de Software Sênior', 15, 92),
      ('Ana Lima', 'Product Manager', 45, 68),
      ('Juliana Batista', 'Analista de Sucesso do Cliente', 10, 89),
      ('Roberto Alves', 'Analista Financeiro', 88, 35) -- Risco Crítico
    `);

    logger.info('Populando [Candidates] (CV Analyzer, Job Description, Ranker)...');
    await dbPool.query(`
      INSERT INTO candidates_ai_analysis (candidate_name, applied_role, cv_summary, ai_match_score, ai_generated_questions, ai_strengths) VALUES 
      ('Luiza Mendes', 'Tech Lead', '10 anos de experiência arquitetando microsserviços. Forte base em liderança técnica e GCP.', 96, '["Descreva o desafio mais crítico que arquitetou em nuvem.", "Como resolve um conflito entre desenvolvedores do squaad?"]', '["Liderança Ténica", "Cloud Architecture", "Comunicação"]'),
      ('Fernando Costa', 'Tech Lead', 'Forte desenvolvedor Backend (Java/Node) sem vivencia corporativa em cargos de gestão de pessoas.', 65, '["Como você supriria a sua falta de vivência liderando diretamente equipes maiores?"]', '["Sólido background técnico em linguagens backend"]'),
      ('Diana Silva', 'Tech Lead', 'Especialista em React, não adere muito ao perfil backend requisitado pelas nuvens do cargo.', 42, '["Nesta vaga lidaremos bastante com servidores GCP, como você avalia sua curva de aprendizado para sair dos frameworks de UI?"]', '["Excelência em UI/UX"]')
    `);

    logger.info('Populando [AI Assets] (Gerador de Imagens, Contratos e Relatórios via IA)...');
    await dbPool.query(`
      INSERT INTO ai_assets (asset_type, title, url, ai_prompt) VALUES 
      ('IMAGE', 'Badge de Onboarding - Nível Ouro', 'https://api.nexus-hr.tech/cdn/images/badge-onboard-3.png', 'Generate a high quality flat vector 2D icon of a golden medal for corporate onboarding, professional style...'),
      ('DOCUMENT', 'Contrato de Trabalho Padrão CLT - Ana Lima', 'https://api.nexus-hr.tech/cdn/docs/clt-ana-lima.pdf', 'Redija um modelo de contrato de trabalho por tempo indeterminado regido pela CLT. Insira cláusulas de propriedade intelectual e remuneração sigilosa para Ana Lima.'),
      ('NEWSLETTER', 'ComunicaRH - Highlights de Março', 'https://api.nexus-hr.tech/cdn/news/mar-26.html', 'Componha um boletim interno caloroso engajando o time de tecnologia sobre as metas atingidas em Março de 2026...'),
      ('REPORT', 'Auditoria Semestral de Turnover Q3', 'https://api.nexus-hr.tech/cdn/reports/turnover-q3.json', 'Consolide os dados brutos de entrada x saídas de funcionários no periodo e cruze com o Score de Engajamento para listar previsoes...')
    `);

    logger.info('Populando [Support & HelpDesk] (Assistente de Chat e Triagem de Ticket Skill)...');
    await dbPool.query(`
      INSERT INTO support_tickets (user_name, issue, ai_resolution, priority) VALUES 
      ('Ana Lima', 'Como funciona a política de de reembolso médico e de transporte uber para off-sites?', 'Conforme a política oficial da cia, reembolsos devem ser abertos no Portal SAP anexando NFs em até 5 dias após a despesa médica ou viagem.', 'BAIXA'),
      ('Roberto Alves', 'Estou sem acesso para subir planilhas no Modulo de Analytics!', 'Ação IA Automática: Encaminhando ticket diretamente para ACL Nível 2 (Infra/TI Cloud). Causa raiz aparentada: Token expirado ou faltando claiims no JWT Role Mappings.', 'ALTA'),
      ('Juliana Batista', 'Preciso adiantar minhas férias em 1 semana por imprevisto familiar.', 'Aviso IA: Solicitações de alteração de gozo de férias fora do período legal de aviso restrito de 30 dias demandam abertura de chamado direto para o BP (Business Partner) do seu time.', 'MÉDIA')
    `);

    logger.info('----------------------------------------------------');
    logger.info('✅ MEGA SEED DO NEON CONCLUÍDO COM SUCESSO! ✅');
    logger.info('Todas as Tabelas Corporativas do SaaS e suas Analises de IA formatadas (JSON, Scores, Vectors) foram salvas no PostgreSQL de Produção!');
    logger.info('----------------------------------------------------');
    
    // Verificacao
    const stats = await dbPool.query('SELECT COUNT(*) as total_candidates FROM candidates_ai_analysis;');
    console.log(stats.rows[0]);
    
    process.exit(0);
  } catch (err) {
    logger.error('Transação Falhou ao salvar massivamente no Neon:', err);
    process.exit(1);
  }
}

seedMegaNeon();
