import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectMongo } from './src/core/mongoDatabase.js';
import { initSocket } from './src/core/socket.js';
import { ModuleManager } from './src/core/ModuleManager.js';
import { SkillController } from './src/controllers/SkillController.js';
import { skillService } from './src/services/SkillService.js';
import { logger } from './src/core/logger.js';
import authRoutes from './src/modules/auth/routes.js';
import { login, register } from './src/modules/auth/controller.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
export const io = initSocket(httpServer);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = parseInt(process.env.PORT as string) || 3001;

// Configuração Socket.io para o Módulo de Comunicação
io.on('connection', (socket) => {
  logger.info(`Cliente Web-Socket conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`Cliente Web-Socket desconectado: ${socket.id}`);
  });
});

// Configuração Endpoints Dinâmicos (Skills via AI Engine)
app.get('/api/skills', SkillController.listSkills);
app.post('/api/skills/:skillName/execute', SkillController.executeSkill);

// Alias Universal de Autenticação Funcional (Conveniente pro Frontend)
app.use('/api/auth', authRoutes);

// Correção automatica Anti-Typo (Para interceptar URLs /loguin ou rotas curtas front-end)
app.post('/loguin', login);
app.post('/login', login);
app.post('/api/loguin', login);

app.get('/api/status', (req, res) => {
  res.json({ status: 'Nexus HR SaaS Platform is Running (PostgreSQL + WebSockets)' });
});

// Inicialização Global Controlada
httpServer.listen(PORT, async () => {
  logger.info(`===============================================`);
  logger.info(`Server SaaS Nexus rodando na porta: ${PORT}`);
  logger.info(`===============================================`);
  
  try {
     // 1. Conectar e Migrar NeonDB (PostgreSQL)
     const { createAllTables } = await import('./src/core/migrations.js');
     await createAllTables();
     logger.info('NeonDB (PostgreSQL): Infraestrutura de tabelas pronta e ativa.');

     // 2. Boot do Motor de IAM (Skills Plugaveis)
     await skillService.boot();
     logger.info('Motor Cérebro de IA Nexus ativado com todas as Skills Mapeadas.');

     // 3. Boot dos Application Modules Web MVC
     const moduleManager = new ModuleManager(app);
     await moduleManager.loadModules();
     logger.info('Rotas modulares de aplicação MVC injetadas e ativas ao ambiente SaaS.');
     
     // 4. Neutralizador CSP: Fallback Global em JSON (Apenas depois dos módulos carregarem)
     app.use((req, res) => {
       res.status(404).json({ success: false, error: 'Endpoint ou arquivo JSON não encontrado na API Node: ' + req.originalUrl });
     });
     
  } catch (err) {
     logger.error('Falha severa na Boot Sequence da Plataforma SaaS:', err);
  }
});

