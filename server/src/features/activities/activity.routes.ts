import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { postActivity, getActivities, deleteActivityById } from './activity.controller';

export const activitiesRouter = Router();

activitiesRouter.use(requireAuth);

activitiesRouter.post('/', postActivity);
activitiesRouter.get('/', getActivities);
activitiesRouter.delete('/:id', deleteActivityById);
