import { createAllTables } from './src/core/migrations';
import { logger } from './src/core/logger';

async function run() {
  console.log('Iniciando Migração Forçada...');
  await createAllTables();
  console.log('Migração concluída.');
  process.exit(0);
}
run();
