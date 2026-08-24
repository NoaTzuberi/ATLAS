export type ConversationRole = 'user' | 'atlas';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  timestamp: string;
}
