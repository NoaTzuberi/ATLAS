const MAX_MESSAGE_LENGTH = 2000;

export function validateMessagePayload(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return 'Invalid request body.';
  }

  const payload = body as { message?: unknown };

  if (typeof payload.message !== 'string' || payload.message.trim().length === 0) {
    return 'message is required.';
  }

  if (payload.message.length > MAX_MESSAGE_LENGTH) {
    return `message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }

  return null;
}
