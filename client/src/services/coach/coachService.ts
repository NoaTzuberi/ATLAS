import { apiClient } from '../api/apiClient';
import type { ConversationMessage } from '../../features/coach/types';

export async function sendMessage(message: string): Promise<{ reply: string }> {
  const { data } = await apiClient.post<{ reply: string }>('/coach/message', { message });
  return data;
}

export async function getConversation(): Promise<ConversationMessage[]> {
  const { data } = await apiClient.get<{ messages: ConversationMessage[] }>('/coach/conversation');
  return data.messages;
}
