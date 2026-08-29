import { apiClient } from '../api/apiClient';
import type { ConversationMessage, SessionSummary, SessionDetail } from '../../features/coach/types';

interface SendMessageResponse {
  reply: string;
  sessionId: string;
  createdWorkout?: { id: string; name: string };
}

export async function sendMessage(message: string, sessionId?: string): Promise<SendMessageResponse> {
  const { data } = await apiClient.post<SendMessageResponse>('/coach/message', { message, sessionId });
  return data;
}

interface ActiveConversationResponse {
  sessionId: string | null;
  messages: ConversationMessage[];
}

export async function getConversation(): Promise<ActiveConversationResponse> {
  const { data } = await apiClient.get<ActiveConversationResponse>('/coach/conversation');
  return data;
}

export async function listSessions(): Promise<SessionSummary[]> {
  const { data } = await apiClient.get<{ sessions: SessionSummary[] }>('/coach/sessions');
  return data.sessions;
}

export async function getSession(sessionId: string): Promise<SessionDetail> {
  const { data } = await apiClient.get<SessionDetail>(`/coach/sessions/${sessionId}`);
  return data;
}
