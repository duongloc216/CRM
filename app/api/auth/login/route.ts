import { getConnection } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError('Email và password là bắt buộc', 400);
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('email', email)
      .query('SELECT id, name, email, role, status, password_hash FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      return apiError('Email hoặc password không đúng', 401);
    }

    const user = result.recordset[0];

    // Verify password với bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return apiError('Email hoặc password không đúng', 401);
    }

    // Mock JWT token (trong production dùng jsonwebtoken library)
    const token = Buffer.from(JSON.stringify({ 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24h
    })).toString('base64');

    // Update last_login
    await pool.request()
      .input('id', user.id)
      .query('UPDATE users SET last_login = GETDATE() WHERE id = @id');

    return apiSuccess({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return apiError('Lỗi server', 500);
  }
}
