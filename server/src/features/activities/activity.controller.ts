import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';
import { validateActivityPayload, validateIdParam, validateListQuery } from './activity.validation';
import { createActivity, listActivities, deleteActivity, ActivityNotFoundError } from './activity.service';

export async function postActivity(req: AuthenticatedRequest, res: Response) {
  const validationError = validateActivityPayload(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const activity = await createActivity(req.userId!, req.body);
  res.status(201).json({ activity });
}

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const validationError = validateListQuery(req.query);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const query = req.query as Record<string, string | undefined>;
  const activities = await listActivities(req.userId!, {
    from: query.from,
    to: query.to,
    limit: query.limit ? Number(query.limit) : undefined,
  });
  res.status(200).json({ items: activities });
}

export async function deleteActivityById(req: AuthenticatedRequest, res: Response) {
  const validationError = validateIdParam(req.params.id);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  try {
    await deleteActivity(String(req.params.id), req.userId!);
    res.status(204).send();
  } catch (error) {
    if (error instanceof ActivityNotFoundError) {
      res.status(404).json({ message: error.message });
      return;
    }
    throw error;
  }
}
