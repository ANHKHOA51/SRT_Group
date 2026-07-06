import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
});

export async function initializeDatabase() {
  try {
    console.log('Connecting to PostgreSQL database via Knex...');
    const hasTable = await db.schema.hasTable('tasks');
    
    if (!hasTable) {
      console.log("Table 'tasks' does not exist. Creating schema with status and deadline...");
      await db.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.string('title', 255).notNullable();
        table.text('description');
        table.enu('status', ['pending', 'ongoing', 'completed'], { useNative: false }).defaultTo('pending');
        table.timestamp('deadline').nullable();
        table.timestamps(true, true);
      });
      console.log("Table 'tasks' created successfully via Knex.");
    } else {
      console.log("Table 'tasks' verified. Checking for updates...");
      const hasStatus = await db.schema.hasColumn('tasks', 'status');
      
      if (!hasStatus) {
        console.log("Altering table 'tasks' to add 'status' (with CHECK constraint) and 'deadline' columns...");
        await db.schema.alterTable('tasks', (table) => {
          table.enu('status', ['pending', 'ongoing', 'completed'], { useNative: false }).defaultTo('pending');
          table.timestamp('deadline').nullable();
          table.dropColumn('completed');
        });
        console.log("Table 'tasks' updated successfully.");
      } else {
        console.log("Table schema is up-to-date. Ensuring status CHECK constraint is applied...");
        await db.raw('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check');
        await db.raw("ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('pending', 'ongoing', 'completed'))");
        console.log("Status CHECK constraint verified successfully.");
      }
    }
  } catch (error) {
    console.error('Database connection or initialization failed via Knex:', error);
    process.exit(1);
  }
}

export default db;
