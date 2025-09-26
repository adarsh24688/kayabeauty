import { NextRequest } from 'next/server';
import { getProducts } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(req: NextRequest) {
  try {
    const result = await getProducts();
    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    return errorHandler(error.message || 'Failed to fetch locations', error);
  }
}
