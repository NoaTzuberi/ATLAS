import type { Types } from 'mongoose';

export type ConversationRole = 'user' | 'atlas';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  timestamp: Date;
}

export interface ConversationSessionDocument {
  userId: Types.ObjectId;
  startedAt: Date;
  lastMessageAt: Date;
  messages: ConversationMessage[];
}
