import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT d.*, c.name as customer_name, u.name as owner_name
      FROM deals d
      LEFT JOIN customers c ON d.customer_id = c.id
      LEFT JOIN users u ON d.owner_id = u.id
      ORDER BY d.created_at DESC
    `);
    return apiSuccess(result.recordset);
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.4: POST - Tạo deal mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation: title là bắt buộc
    if (!body.title || !body.title.trim()) {
      return apiError('Tên cơ hội là bắt buộc', 400);
    }

    const pool = await getConnection();
    
    // Insert deal với parameterized query
    const result = await pool.request()
      .input('title', body.title.trim())
      .input('customer_id', body.customer_id || null)
      .input('value', body.value || null)
      .input('stage', body.stage?.trim() || 'prospect')
      .input('probability', body.probability || 0)
      .input('expected_close_date', body.expected_close_date || null)
      .input('actual_close_date', body.actual_close_date || null)
      .input('description', body.description?.trim() || null)
      .input('owner_id', body.owner_id || null)
      .query(`
        INSERT INTO deals (title, customer_id, value, stage, probability, expected_close_date, actual_close_date, description, owner_id)
        OUTPUT INSERTED.*
        VALUES (@title, @customer_id, @value, @stage, @probability, @expected_close_date, @actual_close_date, @description, @owner_id)
      `);

    return apiSuccess(result.recordset[0], 'Tạo cơ hội thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
} 