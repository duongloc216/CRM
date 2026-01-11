import sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.DB_NAME || 'CustomerManagement',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
    useUTC: true,
  },
  port: parseInt(process.env.DB_PORT || '1433', 10),
  requestTimeout: 30000,
  connectionTimeout: 30000,
  parseJSON: true,
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
    }
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw new Error('Unable to connect to database');
  }
}

export { sql }; 