export type ConversationRole = 'user' | 'atlas';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  timestamp: string;
  /** Set client-side only, on the message from the turn that created it — not persisted. */
  createdWorkout?: { id: string; name: string };
}

export interface SessionSummary {
  id: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
  preview: string;
}

export interface SessionDetail {
  id: string;
  startedAt: string;
  lastMessageAt: string;
  messages: ConversationMessage[];
}
