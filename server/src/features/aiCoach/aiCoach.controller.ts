import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { validateMessagePayload, validateSessionIdParam } from './aiCoach.validation';
import {
  sendMessage,
  getConversationHistory,
  listSessions,
  getSessionById,
  AgentNotConfiguredError,
  AgentRateLimitedError,
  AgentUnavailableError,
  SessionNotFoundError,
} from './agent.service';

export async function postMessage(req: AuthenticatedRequest, res: Response) {
  const validationError = validateMessagePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  try {
    const result = await sendMessage(req.userId!, req.body.message, req.body.sessionId);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AgentNotConfiguredError) {
      res.status(503).json({ message: error.message });
      return;
    }
    if (error instanceof AgentRateLimitedError) {
      res.status(429).json({ message: error.message });
      return;
    }
    if (error instanceof AgentUnavailableError) {
      res.status(503).json({ message: error.message });
      return;
    }
    if (error instanceof SessionNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function getConversation(req: AuthenticatedRequest, res: Response) {
  const conversation = await getConversationHistory(req.userId!);
  res.status(200).json(conversation);
}

export async function getSessions(req: AuthenticatedRequest, res: Response) {
  const sessions = await listSessions(req.userId!);
  res.status(200).json({ sessions });
}

export async function getSession(req: AuthenticatedRequest, res: Response) {
  const validationError = validateSessionIdParam(req.params.sessionId);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  try {
    const session = await getSessionById(req.userId!, String(req.params.sessionId));
    res.status(200).json(session);
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    throw error;
  }
}
