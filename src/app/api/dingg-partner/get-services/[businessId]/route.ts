import { NextRequest } from 'next/server';
import { getServices } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';

export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    // Extract businessId from the dynamic route parameter
    const { businessId } = context.params;

    // Validate businessId
    if (!businessId || businessId.trim() === '') {
      return errorHandler('Business ID is required');
    }

    // Call the service function
    const result = await getServices(businessId);

    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    return errorHandler(
      error.message || 'Failed to fetch services',
      error
    );
  }
}
