import { Schema } from 'joi';
import { NextRequest } from "next/server";


export async function validateJSON<T>(req: NextRequest, schema: Schema): Promise<T> {
  if (!schema) {
    return (await req.json()) as T;
  }

  const body = await req.json();

  const { error, value } = schema.validate(body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    throw new Response(JSON.stringify({
      status: false,
      message: `Validation error: ${message}`,
      fromCache: false
    }), {
      status: 200, // Your backend returns 200 with status: false
      headers: { 'content-type': 'application/json' },
    });
  }

  return value as T;
}
