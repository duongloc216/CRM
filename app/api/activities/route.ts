import { getConnection } from '@/lib/db';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const pool = await getConnection();
    const query = `
      SELECT 
        a.id,
        a.type,
        a.description,
        a.customer_id,
        a.deal_id,
        a.user_id,
        a.activity_date,
        a.created_at,
        c.name as customer_name,
        d.title as deal_title,
        u.name as user_name
      FROM activities a
      LEFT JOIN customers c ON a.customer_id = c.id
      LEFT JOIN deals d ON a.deal_id = d.id
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.activity_date DESC
    `;
    const result = await pool.request().query(query);
    return apiSuccess(result.recordset);
  } catch (err: any) {
    return handleApiError(err);
  }
} 