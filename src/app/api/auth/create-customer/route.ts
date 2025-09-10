import { NextRequest } from 'next/server';
import { createCustomer } from '@/services/auth-service';
import { responseHandler, errorHandler } from '@/lib/response-handler';
import { messages } from '@/lib/messages';
import { validateJSON } from '@/lib/validate';
import { createCustomerSchema } from '@/lib/schemas';
import { CreateCustomerParams } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Get vendor_location_uuid from headers (exactly like your backend)
    const vendor_location_uuid = req.headers.get('vendor_location_uuid');

    if (!vendor_location_uuid) {
      return errorHandler(messages.vendor_location_uuid_required);
    }

    // Validate request body with Joi schema
    const customerData = await validateJSON<CreateCustomerParams>(req, createCustomerSchema);
    // Call the service function
    const result = await createCustomer(customerData, vendor_location_uuid);

    return responseHandler(messages.user.add, true, result);
  } catch (error: any) {
    // Handle validation errors (thrown as Response objects)
    if (error instanceof Response) return error;

    return errorHandler(
      error.message || 'Failed to create customer',
      error
    );
  }
}
