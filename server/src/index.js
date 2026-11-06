import app from './app.js';
import { runMigration } from './db/migrate.js';
import { seedDatabase } from './db/seed.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    // Run schema migrations and seed initial dishes
    await runMigration();
    await seedDatabase();
  } catch (err) {
    console.warn('Bootstrap database check notice:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Sofra Restaurant API running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Environment:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

bootstrap();
