import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = await getConnection();
    // Lấy thông tin khách hàng
    const customerResult = await pool.request().input('id', id).query('SELECT * FROM customers WHERE id = @id');
    if (!customerResult.recordset[0]) {
      return apiError('Customer not found', 404);
    }
    const customer = customerResult.recordset[0];
    // Lấy deals liên quan
    const dealsResult = await pool.request().input('id', id).query('SELECT * FROM deals WHERE customer_id = @id');
    // Lấy activities liên quan
    const activitiesResult = await pool.request()
      .input('id', id)
      .query('SELECT * FROM activities WHERE customer_id = @id');
    
    customer.deals = dealsResult.recordset;
    customer.activities = activitiesResult.recordset;
    return apiSuccess(customer);
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.2: PUT - Cập nhật customer
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    
    // Validation
    if (!body.name || !body.name.trim()) {
      return apiError('Tên khách hàng là bắt buộc', 400);
    }

    const pool = await getConnection();
    
    // Kiểm tra customer tồn tại
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM customers WHERE id = @id');
    
    if (!checkResult.recordset[0]) {
      return apiError('Không tìm thấy khách hàng', 404);
    }

    // Update customer
    const result = await pool.request()
      .input('id', id)
      .input('name', body.name.trim())
      .input('company', body.company?.trim() || null)
      .input('email', body.email?.trim() || null)
      .input('phone', body.phone?.trim() || null)
      .input('address', body.address?.trim() || null)
      .input('source', body.source?.trim() || null)
      .input('status', body.status?.trim() || 'prospect')
      .input('tags', body.tags?.trim() || null)
      .query(`
        UPDATE customers 
        SET name = @name, company = @company, email = @email, phone = @phone,
            address = @address, source = @source, status = @status, tags = @tags
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    return apiSuccess(result.recordset[0], 'Cập nhật khách hàng thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.3: DELETE - Xóa customer
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = await getConnection();
    
    // Kiểm tra customer tồn tại
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM customers WHERE id = @id');
    
    if (!checkResult.recordset[0]) {
      return apiError('Không tìm thấy khách hàng', 404);
    }

    // Kiểm tra có deals liên quan không
    const dealsCheck = await pool.request()
      .input('id', id)
      .query('SELECT COUNT(*) as count FROM deals WHERE customer_id = @id');
    
    if (dealsCheck.recordset[0].count > 0) {
      return apiError('Không thể xóa khách hàng đang có deals liên quan', 400);
    }

    // Xóa activities liên quan trước
    await pool.request()
      .input('id', id)
      .query('DELETE FROM activities WHERE customer_id = @id');

    // Xóa customer
    await pool.request()
      .input('id', id)
      .query('DELETE FROM customers WHERE id = @id');

    return apiSuccess(null, 'Xóa khách hàng thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
} 