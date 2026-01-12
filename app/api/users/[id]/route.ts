import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// GET - Lấy chi tiết user
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', id)
      .query(`
        SELECT id, name, email, role, status, created_at, updated_at, last_login
        FROM users WHERE id = @id
      `);
    
    if (!result.recordset[0]) {
      return apiError('Không tìm thấy người dùng', 404);
    }

    return apiSuccess(result.recordset[0]);
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.8: PUT - Cập nhật user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json();
    
    // Validation
    if (!body.name || !body.name.trim()) {
      return apiError('Tên người dùng là bắt buộc', 400);
    }
    if (!body.email || !body.email.trim()) {
      return apiError('Email là bắt buộc', 400);
    }
    if (body.role && !['admin', 'sales', 'marketing'].includes(body.role)) {
      return apiError('Role không hợp lệ (admin, sales, marketing)', 400);
    }

    const pool = await getConnection();
    
    // Kiểm tra user tồn tại
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM users WHERE id = @id');
    
    if (!checkResult.recordset[0]) {
      return apiError('Không tìm thấy người dùng', 404);
    }

    // Kiểm tra email đã được dùng bởi user khác
    const emailCheck = await pool.request()
      .input('email', body.email.trim())
      .input('id', id)
      .query('SELECT id FROM users WHERE email = @email AND id != @id');
    
    if (emailCheck.recordset.length > 0) {
      return apiError('Email đã được sử dụng bởi người dùng khác', 400);
    }

    // Nếu có password mới, hash nó
    let passwordUpdate = '';
    if (body.password && body.password.length >= 6) {
      const password_hash = await bcrypt.hash(body.password, 10);
      await pool.request()
        .input('id', id)
        .input('password_hash', password_hash)
        .query('UPDATE users SET password_hash = @password_hash WHERE id = @id');
    }

    // Update user info
    const result = await pool.request()
      .input('id', id)
      .input('name', body.name.trim())
      .input('email', body.email.trim())
      .input('role', body.role || 'sales')
      .input('status', body.status?.trim() || 'active')
      .query(`
        UPDATE users 
        SET name = @name, email = @email, role = @role, status = @status
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.status, INSERTED.created_at, INSERTED.updated_at
        WHERE id = @id
      `);

    return apiSuccess(result.recordset[0], 'Cập nhật người dùng thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.8: DELETE - Xóa user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const pool = await getConnection();
    
    // Kiểm tra user tồn tại
    const checkResult = await pool.request()
      .input('id', id)
      .query('SELECT id FROM users WHERE id = @id');
    
    if (!checkResult.recordset[0]) {
      return apiError('Không tìm thấy người dùng', 404);
    }

    // Kiểm tra có dữ liệu liên quan không
    const customersCheck = await pool.request()
      .input('id', id)
      .query('SELECT COUNT(*) as count FROM customers WHERE created_by = @id');
    
    const dealsCheck = await pool.request()
      .input('id', id)
      .query('SELECT COUNT(*) as count FROM deals WHERE owner_id = @id');

    if (customersCheck.recordset[0].count > 0 || dealsCheck.recordset[0].count > 0) {
      return apiError('Không thể xóa người dùng đang có customers hoặc deals liên quan. Hãy chuyển ownership trước.', 400);
    }

    // Xóa activities liên quan
    await pool.request()
      .input('id', id)
      .query('DELETE FROM activities WHERE user_id = @id');

    // Xóa reminders liên quan
    await pool.request()
      .input('id', id)
      .query('DELETE FROM reminders WHERE user_id = @id');

    // Xóa user
    await pool.request()
      .input('id', id)
      .query('DELETE FROM users WHERE id = @id');

    return apiSuccess(null, 'Xóa người dùng thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
}
