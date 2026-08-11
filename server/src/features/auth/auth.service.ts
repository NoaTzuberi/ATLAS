import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../users/user.model';
import { config } from '../../config/env';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

export class EmailAlreadyInUseError extends Error {}
export class InvalidCredentialsError extends Error {}
export class UserNotFoundError extends Error {}

function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: TOKEN_EXPIRY });
}

function toPublicUser(user: UserDocument & { _id: unknown }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

export async function registerUser(name: string, email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new EmailAlreadyInUseError('Email is already registered.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  return { token: signToken(String(user._id)), user: toPublicUser(user) };
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new UserNotFoundError('User not found.');
  }
  return toPublicUser(user);
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new InvalidCredentialsError('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new InvalidCredentialsError('Invalid email or password.');
  }

  return { token: signToken(String(user._id)), user: toPublicUser(user) };
}
