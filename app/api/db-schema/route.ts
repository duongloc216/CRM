import { getConnection } from '@/lib/db';
import { apiSuccess, handleApiError } from '@/lib/api-response';

export async function GET() {
  try {
    const pool = await getConnection();
    
    // Get all tables and their columns
    const result = await pool.request().query(`
      SELECT 
        t.name AS TableName,
        c.name AS ColumnName,
        ty.name AS DataType,
        c.max_length AS MaxLength,
        c.is_nullable AS IsNullable
      FROM sys.tables t
      INNER JOIN sys.columns c ON t.object_id = c.object_id
      INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
      WHERE t.name IN ('users', 'customers', 'deals', 'activities', 'tags', 'customer_tags', 'integrations', 'permissions')
      ORDER BY t.name, c.column_id
    `);
    
    return apiSuccess(result.recordset);
  } catch (err: any) {
    return handleApiError(err);
  }
}
