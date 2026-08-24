import type { Types } from 'mongoose';

export type ConversationRole = 'user' | 'atlas';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  timestamp: Date;
}

export interface ConversationDocument {
  userId: Types.ObjectId;
  messages: ConversationMessage[];
}
