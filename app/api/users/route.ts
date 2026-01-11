import { getConnection } from '@/lib/db';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT TOP 100 * FROM users');
    return apiSuccess(result.recordset);
  } catch (err: any) {
    return handleApiError(err);
  }
} 