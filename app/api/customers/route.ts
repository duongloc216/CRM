import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT TOP 100 * FROM customers ORDER BY created_at DESC');
    return apiSuccess(result.recordset);
  } catch (err: any) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation: name và email là bắt buộc
    if (!body.name || !body.name.trim()) {
      return apiError('Tên khách hàng là bắt buộc', 400);
    }
    if (!body.email || !body.email.trim()) {
      return apiError('Email là bắt buộc', 400);
    }

    const pool = await getConnection();
    
    // Insert customer với parameterized query để tránh SQL injection
    const result = await pool.request()
      .input('name', body.name.trim())
      .input('company', body.company?.trim() || null)
      .input('email', body.email.trim())
      .input('phone', body.phone?.trim() || null)
      .input('address', body.address?.trim() || null)
      .input('source', body.source?.trim() || null)
      .input('status', body.status?.trim() || 'prospect')
      .input('tags', body.tags?.trim() || null)
      .input('created_by', body.created_by || null)
      .query(`
        INSERT INTO customers (name, company, email, phone, address, source, status, tags, created_by)
        OUTPUT INSERTED.*
        VALUES (@name, @company, @email, @phone, @address, @source, @status, @tags, @created_by)
      `);

    return apiSuccess(result.recordset[0], 'Tạo khách hàng thành công');
  } catch (err: any) {
    return handleApiError(err);
  }
} 