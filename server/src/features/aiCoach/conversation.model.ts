import { Schema, model } from 'mongoose';
import type { ConversationDocument, ConversationMessage } from './conversation.types';

const messageSchema = new Schema<ConversationMessage>(
  {
    role: { type: String, enum: ['user', 'atlas'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

/** One persistent conversation per user — a single ongoing thread with their
 * coach, not multiple named chats. Simpler and matches how a coaching
 * relationship actually works; multi-thread history is future scope. */
const conversationSchema = new Schema<ConversationDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  messages: { type: [messageSchema], default: [] },
});

export const Conversation = model<ConversationDocument>('Conversation', conversationSchema);
