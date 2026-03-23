import { dbPool } from './src/core/database';
import { logger } from './src/core/logger';

async function check() {
  if (!dbPool) {
    console.error('Pool not found');
    process.exit(1);
  }
  try {
    const res = await dbPool.query("SELECT column_name FROM information_schema.columns WHERE table_name='employees'");
    console.log('Columns in employees:', res.rows.map(r => r.column_name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
