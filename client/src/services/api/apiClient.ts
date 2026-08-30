import axios from 'axios';
import { getToken, clearToken } from '../auth/tokenStorage';
import { ROUTES } from '../../app/config/routes';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((requestConfig) => {
  const token = getToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

// Endpoints where a 401 means "wrong credentials", not "your session expired" —
// they must never trigger the forced-logout redirect below.
const PUBLIC_AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isPublicAuthCall = PUBLIC_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

      // A 401 on any other endpoint means the stored token is expired/invalid
      // (e.g. it outlived its 7-day lifetime while the SPA session stayed open).
      // Without this, individual pages are left to fail a raw HTTP error rather
      // than being returned to a clean, re-authenticated state.
      if (!isPublicAuthCall) {
        clearToken();
        if (!window.location.pathname.startsWith(ROUTES.LOGIN)) {
          window.location.href = ROUTES.LOGIN;
        }
      }
    }
    return Promise.reject(error);
  },
);
