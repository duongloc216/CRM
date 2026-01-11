import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT c.*, d.title as deal_title, d.value as deal_value, d.stage as deal_stage
      FROM customers c
      LEFT JOIN deals d ON c.id = d.customer_id
    `);
    // Gộp thông tin deal vào từng khách hàng
    const customers = result.recordset.map((row: any) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      email: row.email,
      phone: row.phone,
      address: row.address,
      source: row.source,
      status: row.status,
      tags: row.tags,
      total_value: row.total_value,
      last_contact: row.last_contact,
      created_by: row.created_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      deal: {
        title: row.deal_title,
        value: row.deal_value,
        stage: row.deal_stage
      }
    }));
    return NextResponse.json(customers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 