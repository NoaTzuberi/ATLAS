import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { validateMessagePayload } from './aiCoach.validation';
import {
  sendMessage,
  getConversationHistory,
  AgentNotConfiguredError,
  AgentRateLimitedError,
  AgentUnavailableError,
} from './agent.service';

export async function postMessage(req: AuthenticatedRequest, res: Response) {
  const validationError = validateMessagePayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  try {
    const result = await sendMessage(req.userId!, req.body.message);
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
    throw error;
  }
}

export async function getConversation(req: AuthenticatedRequest, res: Response) {
  const messages = await getConversationHistory(req.userId!);
  res.status(200).json({ messages });
}
