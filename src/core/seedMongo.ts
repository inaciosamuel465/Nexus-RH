import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { EmployeeModel } from '../models/Employee.js';
import { CandidateModel } from '../models/Candidate.js';
import { TicketModel } from '../models/Ticket.js';
import { SectorModel } from '../models/Sector.js';
import { BenefitModel } from '../models/Benefit.js';
import { TrainingModel } from '../models/Training.js';
import { TimeRecordModel } from '../models/TimeRecord.js';
import { HealthRecordModel } from '../models/Safety.js';
import { CommunicationPostModel } from '../models/Communication.js';
import { logger } from './logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_rh';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('=== SEED INDUSTRIAL MASTER ===');

    // Limpar todas as coleções
    const collections = [UserModel, EmployeeModel, CandidateModel, TicketModel, SectorModel, BenefitModel, TrainingModel, TimeRecordModel, HealthRecordModel, CommunicationPostModel];
    for (const col of collections) await col.deleteMany({});

    const tenantId = 'nexus_corp_saas';
    const hash = await bcrypt.hash('123456', 10);

    // ========= USERS =========
    const admin = await UserModel.create({ tenantId, name: 'Diretor Industrial', email: 'admin@nexus.com', passwordHash: hash, role: 'ADMIN' });
    const lider = await UserModel.create({ tenantId, name: 'João Supervisor', email: 'lider@nexus.com', passwordHash: hash, role: 'LIDER' });
    const colab = await UserModel.create({ tenantId, name: 'Ana Operadora', email: 'ana@nexus.com', passwordHash: hash, role: 'COLABORADOR' });

    // ========= SECTORS =========
    const setorEstampagem = await SectorModel.create({
      tenantId, name: 'Estampagem Pesada', leaderId: lider._id,
      trainings: ['Segurança em Prensas (NR-12)', 'Integração Nexus', 'Operação de Ponte Rolante'],
      productivity: 88.5
    });
    const setorLogistica = await SectorModel.create({
      tenantId, name: 'Logística de Expedição', leaderId: admin._id,
      trainings: ['Direção Defensiva de Empilhadeira', 'Gestão de Estoques'],
      productivity: 92.1
    });
    const setorTI = await SectorModel.create({
      tenantId, name: 'Tecnologia da Informação', leaderId: admin._id,
      trainings: ['Segurança da Informação', 'LGPD', 'Cultura DevOps'],
      productivity: 94.3
    });

    // ========= EMPLOYEES =========
    const emp1 = await EmployeeModel.create({
      tenantId, userId: admin._id, registration: 'NX001', name: 'Ricardo Silva',
      role: 'CTO', department: 'Diretoria', sectorId: setorTI._id, contractType: 'CLT',
      userRole: 'ADMIN', salary: 25000, hireDate: '2022-01-01', status: 'Ativo',
      email: 'admin@nexus.com', cpf: '123.456.789-00', phone: '(11) 99999-0001',
      address: { street: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP', zip: '01310-100' },
      bank: { name: 'Itaú Unibanco', agency: '0001', account: '12345-6', pix: 'admin@nexus.com' },
      dependents: [{ name: 'Júlia Silva', type: 'Filha', dob: '2015-05-12' }],
      history: [{ date: '2022-01-01', event: 'Admissão', role: 'CTO', salary: 25000 }],
      performanceScore: 95, vacationBalance: 30
    });

    const emp2 = await EmployeeModel.create({
      tenantId, userId: lider._id, registration: 'NX002', name: 'João Supervisor',
      role: 'Supervisor de Produção', department: 'Produção', sectorId: setorEstampagem._id,
      contractType: 'CLT', userRole: 'MANAGER', salary: 8500, hireDate: '2023-03-15',
      status: 'Ativo', email: 'lider@nexus.com', managerId: emp1._id,
      cpf: '987.654.321-00', phone: '(11) 99999-0002',
      address: { street: 'Rua das Indústrias, 500', city: 'Guarulhos', state: 'SP', zip: '07000-000' },
      bank: { name: 'Nubank', agency: '0001', account: '98765-4', pix: '(11)99999-0002' },
      dependents: [], history: [{ date: '2023-03-15', event: 'Admissão', role: 'Supervisor', salary: 8500 }],
      performanceScore: 88, vacationBalance: 20
    });

    const emp3 = await EmployeeModel.create({
      tenantId, userId: colab._id, registration: 'NX003', name: 'Ana Operadora',
      role: 'Operadora de Prensa', department: 'Produção', sectorId: setorEstampagem._id,
      contractType: 'CLT', userRole: 'EMPLOYEE', salary: 4500, hireDate: '2024-01-10',
      status: 'Ativo', email: 'ana@nexus.com', managerId: emp2._id,
      cpf: '111.222.333-44', phone: '(11) 99999-0003',
      address: { street: 'Rua dos Operários, 100', city: 'Osasco', state: 'SP', zip: '06000-000' },
      bank: { name: 'Bradesco', agency: '1234', account: '56789-0' },
      dependents: [{ name: 'Pedro Oliveira', type: 'Filho', dob: '2020-08-20' }],
      history: [{ date: '2024-01-10', event: 'Admissão', role: 'Operadora', salary: 4500 }],
      performanceScore: 82, vacationBalance: 30
    });

    // Melhor funcionário do setor
    setorEstampagem.bestEmployeeId = emp3._id as any;
    await setorEstampagem.save();

    // ========= CANDIDATES =========
    await CandidateModel.create({
      tenantId, name: 'Marcos Santos', email: 'marcos@email.com',
      appliedRole: 'Desenvolvedor Frontend Sênior', status: 'Pendente',
      cvText: 'Marcos Santos - 5 anos de experiência com React, TypeScript e Node.js. Formado em Ciência da Computação pela USP.'
    });
    await CandidateModel.create({
      tenantId, name: 'Carla Mendes', email: 'carla@email.com',
      appliedRole: 'Analista de Logística', status: 'Entrevista',
      cvText: 'Carla Mendes - 7 anos em gestão de estoques e expedição industrial. MBA em Supply Chain.'
    });

    // ========= BENEFITS =========
    await BenefitModel.create({ tenantId, name: 'Plano de Saúde Bradesco', provider: 'Bradesco Saúde', type: 'Saúde', baseCost: 450, eligibility: 'Todos', active: true });
    await BenefitModel.create({ tenantId, name: 'Vale Alimentação Sodexo', provider: 'Sodexo', type: 'Alimentação', baseCost: 600, eligibility: 'CLT', active: true });
    await BenefitModel.create({ tenantId, name: 'Seguro de Vida MetLife', provider: 'MetLife', type: 'Seguro', baseCost: 80, eligibility: 'Todos', active: true });

    // ========= TRAININGS =========
    await TrainingModel.create({ tenantId, name: 'Cultura Nexus', category: 'Integração', durationHours: 4, instructor: 'RH', active: true, isMandatory: true });
    await TrainingModel.create({ tenantId, name: 'Segurança da Informação', category: 'Compliance', durationHours: 2, instructor: 'TI', active: true, isMandatory: true });
    await TrainingModel.create({ tenantId, name: 'Operação de Prensas (NR-12)', category: 'Obrigatório', durationHours: 8, instructor: 'Eng. Segurança', active: true, isMandatory: true, targetDepartments: ['Produção'] });
    await TrainingModel.create({ tenantId, name: 'Liderança Situacional', category: 'Desenvolvimento', durationHours: 16, instructor: 'Consultoria RH', active: true, isMandatory: false });

    // ========= TIME RECORDS =========
    const today = new Date().toISOString().split('T')[0];
    await TimeRecordModel.create({ tenantId, employeeId: emp3._id, date: today, type: 'Entrada', timestamp: '07:58:00', status: 'Original' });
    await TimeRecordModel.create({ tenantId, employeeId: emp3._id, date: today, type: 'Intervalo Início', timestamp: '12:00:00', status: 'Original' });
    await TimeRecordModel.create({ tenantId, employeeId: emp3._id, date: today, type: 'Intervalo Fim', timestamp: '13:00:00', status: 'Original' });

    // ========= HEALTH =========
    await HealthRecordModel.create({ tenantId, employeeId: emp3._id, type: 'Admissional', date: '2024-01-05', status: 'Apto', nextExam: '2025-01-05', doctorName: 'Dr. Paulo Meira' });
    await HealthRecordModel.create({ tenantId, employeeId: emp2._id, type: 'Periódico', date: '2024-06-15', status: 'Apto', nextExam: '2025-06-15' });

    // ========= TICKETS =========
    await TicketModel.create({ tenantId, requesterId: colab._id, subject: 'Dúvida sobre Férias', description: 'Como funciona o cálculo de 1/3 constitucional?', status: 'Aberto' });
    await TicketModel.create({ tenantId, requesterId: lider._id, subject: 'Solicitação de EPI', description: 'Preciso de novos luvas e óculos para a equipe.', status: 'Aberto' });

    // ========= COMMUNICATION =========
    await CommunicationPostModel.create({
      tenantId, authorId: admin._id, type: 'comunicado', title: 'Bem-vindos ao Nexus RH!',
      content: 'Estamos felizes em apresentar o novo sistema de gestão de pessoas Nexus RH. Explore todos os módulos!',
      reactions: { like: [], aplauso: [], star: [], coração: [] }, comments: [], published: true
    });
    await CommunicationPostModel.create({
      tenantId, authorId: lider._id, type: 'evento', title: 'Workshop de Segurança — NR-12',
      content: 'Convidamos todos do setor de Estampagem para o workshop obrigatório de segurança. Data: próxima segunda-feira.',
      reactions: { like: [], aplauso: [], star: [], coração: [] }, comments: [], published: true
    });

    logger.info('=== SEED COMPLETO ===');
    logger.info(`Users: 3 | Employees: 3 | Sectors: 3 | Benefits: 3 | Trainings: 4 | Candidates: 2`);
    logger.info('Logins: admin@nexus.com / lider@nexus.com / ana@nexus.com (senha: 123456)');
    process.exit(0);
  } catch (err) {
    logger.error('Erro no Seed:', err);
    process.exit(1);
  }
}

seed();
