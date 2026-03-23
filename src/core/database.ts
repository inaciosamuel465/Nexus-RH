import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('seu_usuario')) {
  logger.warn('DATABASE_URL possui uma string generica. Banco de dados (Neon) aguardando credenciais reais no .env.');
}

// Pool Connection Driver Serverless para o Postgres
export const dbPool = connectionString && !connectionString.includes('seu_usuario')
  ? new Pool({ connectionString }) 
  : null;
