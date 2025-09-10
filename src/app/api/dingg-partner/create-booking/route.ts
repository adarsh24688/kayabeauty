import { NextRequest } from 'next/server';
import { createBooking } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { createBookingSchema } from '@/lib/schemas';
import { CreateBookingRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<CreateBookingRequest>(req, createBookingSchema);

    // Call the service function
    const result = await createBooking(body, userToken);

    return responseHandler(messages.record_created, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to create booking',
      error
    );
  }
}
