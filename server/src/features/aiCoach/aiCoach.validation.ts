import mongoose from 'mongoose';

const MAX_MESSAGE_LENGTH = 2000;

export function validateMessagePayload(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return 'Invalid request body.';
  }

  const payload = body as { message?: unknown; sessionId?: unknown };

  if (typeof payload.message !== 'string' || payload.message.trim().length === 0) {
    return 'message is required.';
  }

  if (payload.message.length > MAX_MESSAGE_LENGTH) {
    return `message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  if (payload.sessionId !== undefined && !mongoose.isValidObjectId(payload.sessionId)) {
    return 'sessionId must be a valid id.';
  }

  return null;
}

export function validateSessionIdParam(sessionId: unknown): string | null {
  if (typeof sessionId !== 'string' || !mongoose.isValidObjectId(sessionId)) {
    return 'A valid session id is required.';
  }
  return null;
}
