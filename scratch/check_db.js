const mysql = require('mysql2/promise');

async function check() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'benihseribuan_v2'
  });

  const [rows] = await connection.execute('SELECT id, name FROM products WHERE id IN (1, 13, 9, 4)');
  console.log('Products found:', rows);
  
  const [all] = await connection.execute('SELECT id, name FROM products LIMIT 20');
  console.log('First 20 products:', all);

  await connection.end();
}

check().catch(console.error);
