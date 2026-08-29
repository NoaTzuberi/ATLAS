import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { postMessage, getConversation, getSessions, getSession } from './aiCoach.controller';

export const aiCoachRouter = Router();

aiCoachRouter.use(requireAuth);

aiCoachRouter.post('/message', postMessage);
aiCoachRouter.get('/conversation', getConversation);
aiCoachRouter.get('/sessions', getSessions);
aiCoachRouter.get('/sessions/:sessionId', getSession);
