import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const pool = await getConnection();
    // Không trả về password_hash
    const result = await pool.request().query(`
      SELECT id, name, email, role, status, created_at, updated_at, last_login 
      FROM users 
      ORDER BY created_at DESC
    `);
    return apiSuccess(result.recordset);
  } catch (err: any) {
    return handleApiError(err);
  }
}

// T1.1.7 + T1.1.9: POST - Tạo user mới với password hashing
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation
    if (!body.name || !body.name.trim()) {
      return apiError('Tên người dùng là bắt buộc', 400);
    }
    if (!body.email || !body.email.trim()) {
      return apiError('Email là bắt buộc', 400);
    }
    if (!body.password || body.password.length < 6) {
      return apiError('Mật khẩu phải có ít nhất 6 ký tự', 400);
    }
    if (!body.role || !['admin', 'sales', 'marketing'].includes(body.role)) {
      return apiError('Role không hợp lệ (admin, sales, marketing)', 400);
    }

    const pool = await getConnection();
    
    // Kiểm tra email đã tồn tại
    const emailCheck = await pool.request()
      .input('email', body.email.trim())
      .query('SELECT id FROM users WHERE email = @email');
    
    if (emailCheck.recordset.length > 0) {
      return apiError('Email đã được sử dụng', 400);
    }

    // Hash password server-side (T1.1.9)
    const password_hash = await bcrypt.hash(body.password, 10);

    // Insert user
    const result = await pool.request()
      .input('name', body.name.trim())
      .input('email', body.email.trim())
      .input('password_hash', password_hash)
      .input('role', body.role)
      .input('status', body.status?.trim() || 'active')
      .query(`
        INSERT INTO users (name, email, password_hash, role, status)
        OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.status, INSERTED.created_at
        VALUES (@name, @email, @password_hash, @role, @status)
      `);

    return apiSuccess(result.recordset[0], 'Tạo người dùng thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
} 