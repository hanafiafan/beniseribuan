const mysql = require('mysql2/promise');
// Removed dotenv

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'benihseribuan_v2',
  });

  try {
    console.log('Adding village column to addresses table...');
    await connection.execute('ALTER TABLE addresses ADD COLUMN village VARCHAR(100) AFTER district');
    console.log('Column added successfully!');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists.');
    } else {
      console.error('Migration failed:', error.message);
    }
  } finally {
    await connection.end();
  }
}

migrate();
