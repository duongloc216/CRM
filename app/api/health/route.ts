import { getConnection } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET() {
  try {
    const pool = await getConnection();
    
    // Test query
    const result = await pool.request().query('SELECT 1 as test');
    
    return apiSuccess({
      status: 'connected',
      message: 'Database connection successful',
      serverVersion: pool.config.server,
      database: pool.config.database,
      test: result.recordset[0]
    });
  } catch (err: any) {
    return apiError(
      'Database connection failed',
      503,
      process.env.NODE_ENV === 'development' ? err.message : undefined
    );
  }
}
