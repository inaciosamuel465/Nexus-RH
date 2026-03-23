import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Pool } from '@neondatabase/serverless';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  console.log('=== SEED NEONDB MASTER ===');
  
  try {
    const hash = await bcrypt.hash('123456', 10);
    const tenantId = 'nexus_corp_saas';

    // Limpar tudo com CASCADE (seguro para FK)
    const tablesToClean = [
      'recognitions', 'communication_posts', 'tickets',
      'performance_evaluations', 'epi_records', 'medical_certificates', 'health_records',
      'employee_trainings', 'trainings', 'employee_benefits', 'benefits',
      'vacations', 'time_records', 'payroll', 'candidates', 'jobs',
      'employee_history', 'dependents', 'sectors', 'employees', 'users'
    ];
    for (const t of tablesToClean) {
      try { await pool.query(`DELETE FROM ${t}`); } catch(e) { /* tabela pode nao existir */ }
    }

    // ========= USERS =========
    const u1 = await pool.query(`INSERT INTO users (tenant_id, name, email, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING id`, [tenantId, 'Diretor Industrial', 'admin@nexus.com', hash, 'ADMIN']);
    const u2 = await pool.query(`INSERT INTO users (tenant_id, name, email, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING id`, [tenantId, 'João Supervisor', 'lider@nexus.com', hash, 'LIDER']);
    const u3 = await pool.query(`INSERT INTO users (tenant_id, name, email, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING id`, [tenantId, 'Ana Operadora', 'ana@nexus.com', hash, 'COLABORADOR']);

    // ========= EMPLOYEES =========
    const e1 = await pool.query(`
      INSERT INTO employees (tenant_id, registration, name, role, department, contract_type, user_role, salary, hire_date, status, email, cpf, phone, address_street, address_city, address_state, address_zip, bank_name, bank_agency, bank_account, bank_pix, performance_score, vacation_balance)
      VALUES ($1,'NX001','Ricardo Silva','CTO','Diretoria','CLT','ADMIN',25000,'2022-01-01','Ativo','admin@nexus.com','123.456.789-00','(11) 99999-0001','Av. Paulista, 1000','São Paulo','SP','01310-100','Itaú Unibanco','0001','12345-6','admin@nexus.com',95,30) RETURNING id
    `, [tenantId]);

    const e2 = await pool.query(`
      INSERT INTO employees (tenant_id, registration, name, role, department, contract_type, user_role, salary, hire_date, status, email, manager_id, cpf, phone, address_street, address_city, address_state, address_zip, bank_name, bank_agency, bank_account, performance_score, vacation_balance)
      VALUES ($1,'NX002','João Supervisor','Supervisor de Produção','Produção','CLT','MANAGER',8500,'2023-03-15','Ativo','lider@nexus.com',$2,'987.654.321-00','(11) 99999-0002','Rua das Indústrias, 500','Guarulhos','SP','07000-000','Nubank','0001','98765-4',88,20) RETURNING id
    `, [tenantId, e1.rows[0].id]);

    const e3 = await pool.query(`
      INSERT INTO employees (tenant_id, registration, name, role, department, contract_type, user_role, salary, hire_date, status, email, manager_id, cpf, phone, address_street, address_city, address_state, address_zip, bank_name, bank_agency, bank_account, performance_score, vacation_balance)
      VALUES ($1,'NX003','Ana Operadora','Operadora de Prensa','Produção','CLT','EMPLOYEE',4500,'2024-01-10','Ativo','ana@nexus.com',$2,'111.222.333-44','(11) 99999-0003','Rua dos Operários, 100','Osasco','SP','06000-000','Bradesco','1234','56789-0',82,30) RETURNING id
    `, [tenantId, e2.rows[0].id]);

    const emp1Id = e1.rows[0].id, emp2Id = e2.rows[0].id, emp3Id = e3.rows[0].id;

    // ========= DEPENDENTS =========
    await pool.query(`INSERT INTO dependents (employee_id, name, type, dob) VALUES ($1, 'Júlia Silva', 'Filha', '2015-05-12')`, [emp1Id]);
    await pool.query(`INSERT INTO dependents (employee_id, name, type, dob) VALUES ($1, 'Pedro Oliveira', 'Filho', '2020-08-20')`, [emp3Id]);

    // ========= HISTORY =========
    await pool.query(`INSERT INTO employee_history (employee_id, date, event, role, salary) VALUES ($1, '2022-01-01', 'Admissão', 'CTO', 25000)`, [emp1Id]);
    await pool.query(`INSERT INTO employee_history (employee_id, date, event, role, salary) VALUES ($1, '2023-03-15', 'Admissão', 'Supervisor', 8500)`, [emp2Id]);
    await pool.query(`INSERT INTO employee_history (employee_id, date, event, role, salary) VALUES ($1, '2024-01-10', 'Admissão', 'Operadora', 4500)`, [emp3Id]);

    // ========= SECTORS =========
    await pool.query(`INSERT INTO sectors (tenant_id, name, leader_id, trainings, productivity, best_employee_id) VALUES ($1, 'Estampagem Pesada', $2, $3, 88.5, $4)`, [tenantId, emp2Id, ['Segurança em Prensas (NR-12)', 'Integração Nexus', 'Operação de Ponte Rolante'], emp3Id]);
    await pool.query(`INSERT INTO sectors (tenant_id, name, leader_id, trainings, productivity) VALUES ($1, 'Logística de Expedição', $2, $3, 92.1)`, [tenantId, emp1Id, ['Direção Defensiva de Empilhadeira', 'Gestão de Estoques']]);
    await pool.query(`INSERT INTO sectors (tenant_id, name, leader_id, trainings, productivity) VALUES ($1, 'Tecnologia da Informação', $2, $3, 94.3)`, [tenantId, emp1Id, ['Segurança da Informação', 'LGPD', 'Cultura DevOps']]);

    // ========= JOBS =========
    await pool.query(`INSERT INTO jobs (tenant_id, title, department, status, priority, description, requirements, salary_range) VALUES ($1, 'Desenvolvedor Frontend Sênior', 'Engenharia', 'Open', 'High', 'Liderança técnica frontend.', 'React 18+, TypeScript, Tailwind CSS.', 'R$ 12k - 16k')`, [tenantId]);

    // ========= CANDIDATES =========
    await pool.query(`INSERT INTO candidates (tenant_id, name, email, applied_role, cv_text, status) VALUES ($1, 'Marcos Santos', 'marcos@email.com', 'Desenvolvedor Frontend Sênior', '5 anos com React, TypeScript e Node.js. Formado em CC pela USP.', 'Pendente')`, [tenantId]);
    await pool.query(`INSERT INTO candidates (tenant_id, name, email, applied_role, cv_text, status) VALUES ($1, 'Carla Mendes', 'carla@email.com', 'Analista de Logística', '7 anos em gestão de estoques. MBA em Supply Chain.', 'Entrevista')`, [tenantId]);

    // ========= BENEFITS =========
    await pool.query(`INSERT INTO benefits (tenant_id, name, provider, type, base_cost, eligibility) VALUES ($1, 'Plano de Saúde Bradesco', 'Bradesco Saúde', 'Saúde', 450, 'Todos')`, [tenantId]);
    await pool.query(`INSERT INTO benefits (tenant_id, name, provider, type, base_cost, eligibility) VALUES ($1, 'Vale Alimentação Sodexo', 'Sodexo', 'Alimentação', 600, 'CLT')`, [tenantId]);
    await pool.query(`INSERT INTO benefits (tenant_id, name, provider, type, base_cost, eligibility) VALUES ($1, 'Seguro de Vida MetLife', 'MetLife', 'Seguro', 80, 'Todos')`, [tenantId]);

    // ========= TRAININGS =========
    await pool.query(`INSERT INTO trainings (tenant_id, name, category, duration_hours, instructor, is_mandatory) VALUES ($1, 'Cultura Nexus', 'Integração', 4, 'RH', true)`, [tenantId]);
    await pool.query(`INSERT INTO trainings (tenant_id, name, category, duration_hours, instructor, is_mandatory) VALUES ($1, 'Segurança da Informação', 'Compliance', 2, 'TI', true)`, [tenantId]);
    await pool.query(`INSERT INTO trainings (tenant_id, name, category, duration_hours, instructor, is_mandatory, target_departments) VALUES ($1, 'Operação de Prensas (NR-12)', 'Obrigatório', 8, 'Eng. Segurança', true, $2)`, [tenantId, ['Produção']]);
    await pool.query(`INSERT INTO trainings (tenant_id, name, category, duration_hours, instructor, is_mandatory) VALUES ($1, 'Liderança Situacional', 'Desenvolvimento', 16, 'Consultoria RH', false)`, [tenantId]);

    // ========= TIME RECORDS =========
    const today = new Date().toISOString().split('T')[0];
    await pool.query(`INSERT INTO time_records (tenant_id, employee_id, date, type, timestamp) VALUES ($1, $2, $3, 'Entrada', '07:58:00')`, [tenantId, emp3Id, today]);
    await pool.query(`INSERT INTO time_records (tenant_id, employee_id, date, type, timestamp) VALUES ($1, $2, $3, 'Intervalo Início', '12:00:00')`, [tenantId, emp3Id, today]);
    await pool.query(`INSERT INTO time_records (tenant_id, employee_id, date, type, timestamp) VALUES ($1, $2, $3, 'Intervalo Fim', '13:00:00')`, [tenantId, emp3Id, today]);

    // ========= HEALTH =========
    await pool.query(`INSERT INTO health_records (tenant_id, employee_id, type, date, status, next_exam, doctor_name) VALUES ($1, $2, 'Admissional', '2024-01-05', 'Apto', '2025-01-05', 'Dr. Paulo Meira')`, [tenantId, emp3Id]);
    await pool.query(`INSERT INTO health_records (tenant_id, employee_id, type, date, status, next_exam) VALUES ($1, $2, 'Periódico', '2024-06-15', 'Apto', '2025-06-15')`, [tenantId, emp2Id]);

    // ========= TICKETS =========
    await pool.query(`INSERT INTO tickets (tenant_id, requester_id, subject, description) VALUES ($1, $2, 'Dúvida sobre Férias', 'Como funciona o cálculo de 1/3 constitucional?')`, [tenantId, emp3Id]);

    // ========= COMMUNICATION =========
    await pool.query(`INSERT INTO communication_posts (tenant_id, author_id, type, title, content) VALUES ($1, $2, 'comunicado', 'Bem-vindos ao Nexus RH!', 'Estamos felizes em apresentar o novo sistema de gestão de pessoas Nexus RH.')`, [tenantId, emp1Id]);
    await pool.query(`INSERT INTO communication_posts (tenant_id, author_id, type, title, content) VALUES ($1, $2, 'evento', 'Workshop de Segurança — NR-12', 'Convidamos todos do setor de Estampagem para o workshop obrigatório.')`, [tenantId, emp2Id]);

    console.log('=== SEED NEONDB CONCLUÍDO ===');
    console.log('Users: 3 | Employees: 3 | Sectors: 3 | Benefits: 3 | Trainings: 4');
    console.log('Logins: admin@nexus.com / lider@nexus.com / ana@nexus.com (senha: 123456)');
  } catch (err) {
    console.error('ERRO NO SEED:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
