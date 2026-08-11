import { Request, Response } from 'express';
import { validateRegisterInput, validateLoginInput } from './auth.validation';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  EmailAlreadyInUseError,
  InvalidCredentialsError,
  UserNotFoundError,
} from './auth.service';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export async function register(req: Request, res: Response) {
  const validationError = validateRegisterInput(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const { name, email, password } = req.body;

  try {
    const result = await registerUser(name, email, password);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      res.status(409).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const validationError = validateLoginInput(req.body);
  if (validationError) {
    res.status(400).json({ message: validationError });
    return;
  }

  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      res.status(401).json({ message: error.message });
      return;
    }
    throw error;
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await getCurrentUser(req.userId!);
    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      res.status(401).json({ message: error.message });
      return;
    }
    throw error;
  }
}
