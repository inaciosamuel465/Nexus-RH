import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.js';
import { EmployeeModel } from '../models/Employee.js';
import { CandidateModel } from '../models/Candidate.js';
import { TicketModel } from '../models/Ticket.js';
import { SectorModel } from '../models/Sector.js';
import { logger } from './logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_rh';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Conectado ao MongoDB para Seeding Industrial...');

    // Limpar coleções
    await UserModel.deleteMany({});
    await EmployeeModel.deleteMany({});
    await CandidateModel.deleteMany({});
    await TicketModel.deleteMany({});
    await SectorModel.deleteMany({});

    const tenantId = 'nexus_corp_saas';

    // 1. Criar Usuário Admin / Master
    const admin = new UserModel({
      tenantId,
      name: 'Diretor Industrial',
      email: 'admin@nexus.com',
      passwordHash: 'hash_simulada',
      role: 'ADMIN'
    });
    await admin.save();

    // 2. Criar Usuário Líder de Setor
    const lider = new UserModel({
      tenantId,
      name: 'João Supervisor',
      email: 'lider@nexus.com',
      passwordHash: 'hash_simulada',
      role: 'LIDER'
    });
    await lider.save();

    // 3. Criar os Setores (Ex: Estampagem)
    const setorEstampagem = new SectorModel({
      tenantId,
      name: 'Estampagem Pesada',
      leaderId: lider._id,
      trainings: [
        'Segurança em Prensas (NR-12)',
        'Integração de Cultura Nexus',
        'Operação de Ponte Rolante'
      ],
      productivity: 88.5,
    });
    await setorEstampagem.save();

    const setorLogistica = new SectorModel({
        tenantId,
        name: 'Logística de Expedição',
        leaderId: admin._id,
        trainings: ['Direção Defensiva de Empilhadeira', 'Gestão de Estoques'],
        productivity: 92.1
    });
    await setorLogistica.save();

    // 4. Criar Colaboradores e vincular aos setores
    const emp1 = new EmployeeModel({
      tenantId,
      userId: admin._id, // Usando o ID do admin como exemplo de vínculo de login
      name: 'Carlos Operador',
      role: 'Operador de Prensa',
      department: 'Produção',
      sectorId: setorEstampagem._id,
      salary: 4500,
      performanceScore: 95,
      turnoverRisk: 5
    });
    await emp1.save();

    // Definir Carlos como o melhor funcionário do setor
    setorEstampagem.bestEmployeeId = emp1._id as any;
    await setorEstampagem.save();

    const emp2 = new EmployeeModel({
        tenantId,
        userId: lider._id,
        name: 'Beatriz Analista',
        role: 'Analista de Logística',
        department: 'Expedição',
        sectorId: setorLogistica._id,
        salary: 6200,
        performanceScore: 89,
        turnoverRisk: 12
    });
    await emp2.save();

    logger.info('==============================================');
    logger.info('Seed Industrial MongoDB concluído com Sucesso!');
    logger.info('Setores criados: Estampagem e Logística.');
    logger.info('Privacidade: Colaboradores vinculados e travados.');
    logger.info('==============================================');
    process.exit(0);
  } catch (err) {
    logger.error('Erro no Seeding MongoDB:', err);
    process.exit(1);
  }
}

seed();
