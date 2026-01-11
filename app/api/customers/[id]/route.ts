import { getConnection } from '@/lib/db';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';

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