import { NextResponse } from 'next/server';

interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
  total?: number;
  fromCache?: boolean;
}

export function responseHandler(
  message: string,
  status: boolean = false,
  data: any = null
): NextResponse<ApiResponse> {
  const resObject: ApiResponse = {
    status: status,
    message: message,
    fromCache: false,
  };

  if (status && data) {
    if (data.total) {
      resObject.data = data.data;
      resObject.total = data.total;
    } else {
      resObject.data = data;
    }
  }

  // In Next.js, we always return 200 and let the status field indicate success/failure
  // This matches your current backend pattern
  return NextResponse.json(resObject, { status: 200 });
}

export function errorHandler(message: string, error?: any): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  return responseHandler(message, false);
}
