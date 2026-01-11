import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function apiError(message: string, status = 500, details?: any) {
  const response: any = {
    success: false,
    error: message,
  };

  // Only include details in development
  if (process.env.NODE_ENV === 'development' && details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

export function handleApiError(error: any) {
  console.error('API Error:', error);

  if (error.code === 'ECONNREFUSED') {
    return apiError('Database connection failed', 503);
  }

  if (error.code === 'EREQUEST') {
    return apiError('Invalid database query', 400);
  }

  // Generic error - don't expose internals
  return apiError('Internal server error', 500);
}
