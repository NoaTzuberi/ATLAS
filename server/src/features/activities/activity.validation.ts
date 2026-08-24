import mongoose from 'mongoose';
import { ACTIVITY_TYPE_IDS } from './activity.constants';

function isStringInSet(value: unknown, allowed: readonly string[]): boolean {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

interface ActivityMetadataInput {
  board?: unknown;
  location?: unknown;
  notes?: unknown;
}

interface ActivityInput {
  type?: unknown;
  date?: unknown;
  duration?: unknown;
  difficulty?: unknown;
  distance?: unknown;
  metadata?: unknown;
}

export function validateActivityPayload(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return 'Invalid request body.';
  }

  const payload = body as ActivityInput;

  if (!isStringInSet(payload.type, ACTIVITY_TYPE_IDS)) {
    return 'type must be one of the supported activity types.';
  }

  if (payload.date !== undefined) {
    if (typeof payload.date !== 'string' || Number.isNaN(Date.parse(payload.date))) {
      return 'date must be a valid ISO date string.';
    }
  }

  if (typeof payload.duration !== 'number' || payload.duration <= 0) {
    return 'duration is required and must be a positive number.';
  }

  if (payload.difficulty !== undefined) {
    if (typeof payload.difficulty !== 'number' || payload.difficulty < 1 || payload.difficulty > 5) {
      return 'difficulty must be a number between 1 and 5.';
    }
  }

  if (payload.distance !== undefined) {
    if (typeof payload.distance !== 'number' || payload.distance < 0) {
      return 'distance must be a non-negative number.';
    }
  }

  if (payload.metadata !== undefined) {
    if (typeof payload.metadata !== 'object' || payload.metadata === null) {
      return 'metadata must be an object.';
    }
    const m = payload.metadata as ActivityMetadataInput;
    if (m.board !== undefined && typeof m.board !== 'string') return 'metadata.board must be a string.';
    if (m.location !== undefined && typeof m.location !== 'string') return 'metadata.location must be a string.';
    if (m.notes !== undefined && typeof m.notes !== 'string') return 'metadata.notes must be a string.';
  }

  return null;
}

export function validateIdParam(id: unknown): string | null {
  if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
    return 'A valid activity id is required.';
  }
  return null;
}

export function validateListQuery(query: unknown): string | null {
  if (typeof query !== 'object' || query === null) {
    return 'Invalid query parameters.';
  }

  const params = query as Record<string, unknown>;

  if (params.limit !== undefined) {
    const limit = Number(params.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
      return 'limit must be an integer between 1 and 200.';
    }
  }

  if (params.from !== undefined && Number.isNaN(Date.parse(String(params.from)))) {
    return 'from must be a valid ISO date string.';
  }

  if (params.to !== undefined && Number.isNaN(Date.parse(String(params.to)))) {
    return 'to must be a valid ISO date string.';
  }

  return null;
}
