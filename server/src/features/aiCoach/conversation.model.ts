import { Schema, model } from 'mongoose';
import type { ConversationSessionDocument, ConversationMessage } from './conversation.types';

const messageSchema = new Schema<ConversationMessage>(
  {
    role: { type: String, enum: ['user', 'atlas'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

/** One document per conversation session. A user has many sessions over time —
 * the most recent one (by lastMessageAt) is "active" until it goes stale past
 * the inactivity timeout (see SESSION_TIMEOUT_MS in agent.service.ts), at which
 * point the next message starts a new session instead of appending to it. */
const conversationSessionSchema = new Schema<ConversationSessionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startedAt: { type: Date, required: true, default: () => new Date() },
  lastMessageAt: { type: Date, required: true, default: () => new Date() },
  messages: { type: [messageSchema], default: [] },
});

conversationSessionSchema.index({ userId: 1, lastMessageAt: -1 });

export const ConversationSession = model<ConversationSessionDocument>(
  'ConversationSession',
  conversationSessionSchema,
);
