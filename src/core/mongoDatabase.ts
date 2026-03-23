import mongoose from 'mongoose';
import { logger } from './logger.js';

export const connectMongo = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus-hr-saas';
  
  if (uri.includes('localhost')) {
     logger.warn('MONGO_URI não detectado. Utilizando banco local de fallback para o Mongoose (SaaS Storage).');
  }

  try {
    await mongoose.connect(uri);
    logger.info('Mongoose: Conectado ao MongoDB com sucesso (Document Storage Multi-Tenant Ativo).');
  } catch (err) {
    logger.error('Mongoose: Erro crítico ao conectar ao MongoDB:', err);
  }
};
