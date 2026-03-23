import dotenv from 'dotenv';
dotenv.config();

import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
  console.log('=== CRIANDO TABELAS NO NEONDB ===');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      registration VARCHAR(20),
      name VARCHAR(200) NOT NULL,
      role VARCHAR(100) NOT NULL,
      department VARCHAR(100) NOT NULL,
      sector_id INTEGER,
      contract_type VARCHAR(50) DEFAULT 'CLT',
      user_role VARCHAR(20) DEFAULT 'EMPLOYEE',
      salary NUMERIC(12,2) NOT NULL DEFAULT 0,
      hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
      status VARCHAR(30) DEFAULT 'Ativo',
      email VARCHAR(200) NOT NULL,
      manager_id INTEGER,
      cpf VARCHAR(14),
      rg VARCHAR(20),
      phone VARCHAR(20),
      birth_date DATE,
      address_street VARCHAR(200),
      address_city VARCHAR(100),
      address_state VARCHAR(2),
      address_zip VARCHAR(10),
      bank_name VARCHAR(100),
      bank_agency VARCHAR(20),
      bank_account VARCHAR(20),
      bank_pix VARCHAR(100),
      performance_score NUMERIC(5,2) DEFAULT 0,
      turnover_risk NUMERIC(5,2) DEFAULT 0,
      vacation_balance INTEGER DEFAULT 30,
      onboarding_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS dependents (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      type VARCHAR(50) NOT NULL,
      dob DATE
    )`,
    `CREATE TABLE IF NOT EXISTS employee_history (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      event VARCHAR(200) NOT NULL,
      role VARCHAR(100),
      salary NUMERIC(12,2)
    )`,
    `CREATE TABLE IF NOT EXISTS sectors (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      name VARCHAR(200) NOT NULL,
      leader_id INTEGER,
      trainings TEXT[] DEFAULT '{}',
      productivity NUMERIC(5,2) DEFAULT 0,
      best_employee_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200),
      phone VARCHAR(20),
      applied_role VARCHAR(200),
      job_id INTEGER,
      stage VARCHAR(50) DEFAULT 'Triagem',
      score NUMERIC(5,2),
      cv_text TEXT,
      cv_summary TEXT,
      ai_score NUMERIC(5,2),
      ai_analysis JSONB,
      status VARCHAR(50) DEFAULT 'Pendente',
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      title VARCHAR(200) NOT NULL,
      department VARCHAR(100),
      status VARCHAR(20) DEFAULT 'Open',
      priority VARCHAR(20) DEFAULT 'Medium',
      description TEXT,
      requirements TEXT,
      salary_range VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS payroll (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      month VARCHAR(7) NOT NULL,
      gross_salary NUMERIC(12,2),
      net_salary NUMERIC(12,2),
      events JSONB DEFAULT '[]',
      total_deductions NUMERIC(12,2) DEFAULT 0,
      total_earnings NUMERIC(12,2) DEFAULT 0,
      fgts_value NUMERIC(12,2) DEFAULT 0,
      status VARCHAR(30) DEFAULT 'Aberto',
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS time_records (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      date DATE NOT NULL,
      type VARCHAR(30) NOT NULL,
      timestamp VARCHAR(20) NOT NULL,
      status VARCHAR(30) DEFAULT 'Original',
      location VARCHAR(100),
      justification TEXT,
      manager_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS vacations (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      days INTEGER NOT NULL,
      status VARCHAR(30) DEFAULT 'Pendente',
      type VARCHAR(30) DEFAULT 'Individual',
      sell_ten_days BOOLEAN DEFAULT FALSE,
      request_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS benefits (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      name VARCHAR(200) NOT NULL,
      provider VARCHAR(200),
      type VARCHAR(50),
      base_cost NUMERIC(12,2),
      eligibility VARCHAR(100) DEFAULT 'Todos',
      description TEXT,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS employee_benefits (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      benefit_id INTEGER REFERENCES benefits(id),
      status VARCHAR(30) DEFAULT 'Ativo',
      enrollment_date DATE DEFAULT CURRENT_DATE,
      card_number VARCHAR(50)
    )`,
    `CREATE TABLE IF NOT EXISTS trainings (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      name VARCHAR(200) NOT NULL,
      category VARCHAR(50),
      duration_hours INTEGER,
      description TEXT,
      instructor VARCHAR(200),
      active BOOLEAN DEFAULT TRUE,
      target_departments TEXT[] DEFAULT '{}',
      is_mandatory BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS employee_trainings (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      training_id INTEGER REFERENCES trainings(id),
      status VARCHAR(30) DEFAULT 'Pendente',
      assigned_by VARCHAR(50) DEFAULT 'Sistema',
      progress INTEGER DEFAULT 0,
      assigned_date DATE DEFAULT CURRENT_DATE,
      completion_date DATE
    )`,
    `CREATE TABLE IF NOT EXISTS health_records (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      type VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(30) NOT NULL,
      next_exam DATE,
      doctor_name VARCHAR(200),
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS medical_certificates (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      days INTEGER NOT NULL,
      reason VARCHAR(300),
      cid VARCHAR(10),
      doctor_name VARCHAR(200),
      crm VARCHAR(20),
      status VARCHAR(30) DEFAULT 'Pendente',
      abono_horas BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS epi_records (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      item VARCHAR(200) NOT NULL,
      ca_number VARCHAR(30),
      delivery_date DATE NOT NULL,
      validity_months INTEGER,
      status VARCHAR(30) DEFAULT 'Entregue'
    )`,
    `CREATE TABLE IF NOT EXISTS performance_evaluations (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER REFERENCES employees(id),
      evaluator_id INTEGER,
      period VARCHAR(20),
      performance_score NUMERIC(5,2) DEFAULT 0,
      potential_score NUMERIC(5,2) DEFAULT 0,
      competencies JSONB DEFAULT '[]',
      goals JSONB DEFAULT '[]',
      pdi TEXT,
      status VARCHAR(30) DEFAULT 'Rascunho',
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS communication_posts (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      author_id INTEGER,
      type VARCHAR(30) NOT NULL,
      title VARCHAR(300) NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      target_departments TEXT[] DEFAULT '{}',
      target_roles TEXT[] DEFAULT '{}',
      reactions JSONB DEFAULT '{"like":[],"aplauso":[],"star":[],"coração":[]}',
      comments JSONB DEFAULT '[]',
      published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      requester_id INTEGER,
      subject VARCHAR(300) NOT NULL,
      description TEXT,
      status VARCHAR(30) DEFAULT 'Aberto',
      priority VARCHAR(20),
      category VARCHAR(50),
      ai_resolution TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS recognitions (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(100) NOT NULL DEFAULT 'nexus_corp_saas',
      employee_id INTEGER,
      granted_by INTEGER,
      type VARCHAR(50),
      title VARCHAR(200),
      description TEXT,
      points INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`
  ];

  for (const sql of tables) {
    try {
      await pool.query(sql);
    } catch (err: any) {
      console.error('Erro em tabela:', err.message);
    }
  }

  console.log('=== TABELAS CRIADAS COM SUCESSO ===');
  await pool.end();
  process.exit(0);
}

runMigration();
