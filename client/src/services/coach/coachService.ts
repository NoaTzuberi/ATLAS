import { apiClient } from '../api/apiClient';
import type { ConversationMessage } from '../../features/coach/types';

interface SendMessageResponse {
  reply: string;
  createdWorkout?: { id: string; name: string };
}

export async function sendMessage(message: string): Promise<SendMessageResponse> {
  const { data } = await apiClient.post<SendMessageResponse>('/coach/message', { message });
  return data;
}

export async function getConversation(): Promise<ConversationMessage[]> {
  const { data } = await apiClient.get<{ messages: ConversationMessage[] }>('/coach/conversation');
  return data.messages;
}
