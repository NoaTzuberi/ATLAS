import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { postMessage, getConversation } from './aiCoach.controller';

export const aiCoachRouter = Router();

aiCoachRouter.use(requireAuth);

aiCoachRouter.post('/message', postMessage);
aiCoachRouter.get('/conversation', getConversation);
