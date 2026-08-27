import axios from 'axios';
import { apiClient } from '../api/apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return fallback;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Registration failed. Please try again.'));
  }
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Login failed. Please try again.'));
  }
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}

export async function requestPasswordReset(email: string): Promise<string> {
  try {
    const { data } = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    return data.message;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Couldn't send the reset email. Please try again."));
  }
}

export async function resetPassword(token: string, password: string): Promise<string> {
  try {
    const { data } = await apiClient.post<{ message: string }>('/auth/reset-password', { token, password });
    return data.message;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Couldn't reset your password. Please try again."));
  }
}
