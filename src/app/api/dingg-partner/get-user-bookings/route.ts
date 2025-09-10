import { NextRequest } from 'next/server';
import { getUserBookings } from '@/services/dingg-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { getUserBookingsSchema } from '@/lib/schemas';
import { GetUserBookingsRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const userToken = req.headers.get('authorization');
    if (!userToken) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<GetUserBookingsRequest>(req, getUserBookingsSchema);

    // Call the service function
    const result = await getUserBookings(body, userToken);

    return responseHandler(messages.record_found, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to fetch user bookings',
      error
    );
  }
}
