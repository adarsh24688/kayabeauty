import { NextRequest } from 'next/server';
import { profileSetup } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { profileSetupSchema } from '@/lib/schemas';
import { ProfileSetupRequest } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get auth token from headers
    const token = req.headers.get('authorization');
    if (!token) {
      return errorHandler('Authorization token is required');
    }

    // Validate request body
    const body = await validateJSON<ProfileSetupRequest>(req, profileSetupSchema);

    // Call the service function
    const result = await profileSetup(body, token);

    return responseHandler(messages.user.profile_setup, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to setup profile',
      error
    );
  }
}
