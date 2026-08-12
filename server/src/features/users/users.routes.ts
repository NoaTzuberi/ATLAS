import { Router } from 'express';
import { updateProfile } from './users.controller';
import { requireAuth } from '../../middleware/auth.middleware';

export const usersRouter = Router();

usersRouter.put('/profile', requireAuth, updateProfile);
