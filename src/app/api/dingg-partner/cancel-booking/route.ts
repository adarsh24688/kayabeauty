import { NextRequest } from 'next/server';
import { cancelBooking } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { cancelBookingSchema } from '@/lib/schemas';
import { CancelBookingRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<CancelBookingRequest>(req, cancelBookingSchema);

    // Call the service function
    const result = await cancelBooking(body, userToken);

    return responseHandler(messages.record_deleted, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to cancel booking',
      error
    );
  }
}
