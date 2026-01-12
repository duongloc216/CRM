import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';

// T3.6.2: GET - Lấy chi tiết deal
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT d.*, c.name as customer_name, u.name as owner_name
        FROM deals d
        LEFT JOIN customers c ON d.customer_id = c.id
        LEFT JOIN users u ON d.owner_id = u.id
        WHERE d.id = @id
      `);
    
    if (!result.recordset[0]) {
      return apiError('Không tìm thấy cơ hội', 404);
    }

    const deal = result.recordset[0];

    // Lấy activities liên quan
    const activitiesResult = await pool.request()
      .input('id', id)
      .query('SELECT * FROM activities WHERE deal_id = @id ORDER BY activity_date DESC');
    
    deal.activities = activitiesResult.recordset;

    return apiSuccess(deal);
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.5: PUT - Cập nhật deal
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    
    // Validation
    if (!body.title || !body.title.trim()) {
      return apiError('Tên cơ hội là bắt buộc', 400);
    }

    const pool = await getConnection();
    
    // Kiểm tra deal tồn tại
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM deals WHERE id = @id');
    
    if (!checkResult.recordset[0]) {
      return apiError('Không tìm thấy cơ hội', 404);
    }

    // Update deal
    const result = await pool.request()
      .input('id', id)
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
        UPDATE deals 
        SET title = @title, customer_id = @customer_id, value = @value, 
            stage = @stage, probability = @probability,
            expected_close_date = @expected_close_date, actual_close_date = @actual_close_date,
            description = @description, owner_id = @owner_id
        OUTPUT INSERTED.*, 
               (SELECT name FROM customers WHERE id = INSERTED.customer_id) as customer_name,
               (SELECT name FROM users WHERE id = INSERTED.owner_id) as owner_name
        WHERE id = @id
      `);

    return apiSuccess(result.recordset[0], 'Cập nhật cơ hội thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.6: DELETE - Xóa deal
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = await getConnection();
    
    // Kiểm tra deal tồn tại
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM deals WHERE id = @id');
    
    if (!checkResult.recordset[0]) {
      return apiError('Không tìm thấy cơ hội', 404);
    }

    // Xóa activities liên quan trước
    await pool.request()
      .input('id', id)
      .query('DELETE FROM activities WHERE deal_id = @id');

    // Xóa deal
    await pool.request()
      .input('id', id)
      .query('DELETE FROM deals WHERE id = @id');

    return apiSuccess(null, 'Xóa cơ hội thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
}
