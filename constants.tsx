
import React from 'react';
import { TimeRecord, Employee, JobOpening } from './types';

export const ICONS = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  Employees: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ),
  Recruitment: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  ),
  Time: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  Payroll: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ),
  AI: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
  ),
  OrgChart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
  ),
  Training: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ),
  Performance: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  ),
  Vacation: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
  Benefits: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ),
  Lifecycle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
  ),
  Safety: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  SelfService: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  )
};

export const DEFAULT_ONBOARDING_TASKS = [
  { id: 't1', label: 'Contrato Assinado', completed: false },
  { id: 't2', label: 'Cadastro eSocial', completed: false },
  { id: 't3', label: 'Entrega de Kit (Laptop/Crachá)', completed: false },
  { id: 't4', label: 'Acessos Sistemas (Slack/Email)', completed: false },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { 
    id: '0', 
    registration: 'ADM001', 
    name: 'Administrador Nexus', 
    role: 'Gestor de Sistemas', 
    department: 'TI / Governança', 
    contractType: 'PJ',
    userRole: 'ADMIN',
    salary: 0, 
    hireDate: '2020-01-01', 
    status: 'Ativo', 
    email: 'admin@nexus.com', 
    managerId: null,
    bank: { name: 'Banco Central', agency: '0001', account: '00001-0' },
    dependents: [],
    history: [{ date: '2020-01-01', event: 'Ativação de Conta Mestra', role: 'Administrador', salary: 0 }],
    vacationBalance: 0
  },
  { 
    id: '1', 
    registration: 'NX001', 
    name: 'Ricardo Silva', 
    role: 'CTO', 
    department: 'Diretoria', 
    contractType: 'CLT',
    userRole: 'MANAGER',
    salary: 25000, 
    hireDate: '2022-01-01', 
    status: 'Ativo', 
    email: 'ricardo@nexus.com', 
    managerId: null,
    bank: { name: 'Itaú Unibanco', agency: '0001', account: '12345-6' },
    dependents: [{ name: 'Júlia Silva', type: 'Filha', dob: '2015-05-12' }],
    history: [
      { date: '2022-01-01', event: 'Admissão', role: 'CTO', salary: 25000 },
    ],
    onboardingTasks: DEFAULT_ONBOARDING_TASKS.map(t => ({ ...t, completed: true })),
    vacationBalance: 30
  },
  { 
    id: '2', 
    registration: 'NX002', 
    name: 'Ana Oliveira', 
    role: 'Gerente de Engenharia', 
    department: 'Engenharia', 
    contractType: 'CLT',
    userRole: 'EMPLOYEE',
    salary: 18000, 
    hireDate: '2022-03-15', 
    status: 'Ativo', 
    email: 'ana@nexus.com', 
    managerId: '1',
    bank: { name: 'Nubank', agency: '0001', account: '98765-4' },
    dependents: [],
    history: [
      { date: '2022-03-15', event: 'Admissão', role: 'Líder Técnica', salary: 14000 },
      { date: '2023-01-01', event: 'Promoção', role: 'Gerente de Engenharia', salary: 18000 },
    ],
    onboardingTasks: DEFAULT_ONBOARDING_TASKS.map(t => ({ ...t, completed: true })),
    vacationBalance: 30
  }
];

export const MOCK_TIME_RECORDS: TimeRecord[] = [
  { id: 'tr1', employeeId: '2', date: '2024-11-25', type: 'Entrada', timestamp: '09:00:00', status: 'Original', location: '-23.5505, -46.6333' },
  { id: 'tr2', employeeId: '2', date: '2024-11-25', type: 'Saída', timestamp: '18:00:00', status: 'Original', location: '-23.5505, -46.6333' },
];

export const MOCK_JOBS: JobOpening[] = [
  { 
    id: 'v1', 
    title: 'Desenvolvedor Frontend Sênior', 
    department: 'Engenharia', 
    status: 'Open', 
    priority: 'High', 
    requirements: 'React 18+, TypeScript, Tailwind CSS.',
    description: 'Liderança técnica frontend.',
    salaryRange: 'R$ 12k - 16k'
  }
];

export const MOCK_CANDIDATES = [
  { id: 'can1', name: 'João Pereira', role: 'Frontend Dev', score: 85, stage: 'Entrevista Técnica' }
];

export const MOCK_BENEFITS = [
  { id: 'b1', name: 'Plano de Saúde Bradesco', provider: 'Bradesco', type: 'Saúde', baseCost: 450, eligibility: 'Todos', active: true },
];

export const MOCK_HEALTH_RECORDS = [
  { id: 'h1', employeeId: '2', type: 'Periódico', date: '2023-11-10', status: 'Apto', nextExam: '2024-11-10' },
];
