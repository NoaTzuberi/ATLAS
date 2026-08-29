import { GoogleGenAI, ApiError } from '@google/genai';
import type { Content, FunctionCall, Part } from '@google/genai';
import { config } from '../../config/env';
import { ConversationSession } from './conversation.model';
import { getMemories } from './aiMemory.service';
import { getUserProfileById } from '../users/users.service';
import { AGENT_TOOLS, executeTool } from './tools';
import type { ConversationMessage, ConversationSessionDocument } from './conversation.types';
import type { HydratedDocument } from 'mongoose';

export class AgentNotConfiguredError extends Error {}
export class AgentRateLimitedError extends Error {}
export class AgentUnavailableError extends Error {}
export class SessionNotFoundError extends Error {}

const MODEL = 'gemini-3.6-flash';
const MAX_TOOL_ITERATIONS = 8;
const MAX_HISTORY_MESSAGES = 20;

/** How long a session can sit inactive before the next message starts a fresh one instead. */
const SESSION_TIMEOUT_MS = 4 * 60 * 60 * 1000;

export interface SessionSummary {
  id: string;
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  preview: string;
}

export interface SessionDetail {
  id: string;
  startedAt: Date;
  lastMessageAt: Date;
  messages: ConversationMessage[];
}

function isStale(session: Pick<ConversationSessionDocument, 'lastMessageAt'>): boolean {
  return Date.now() - session.lastMessageAt.getTime() > SESSION_TIMEOUT_MS;
}

function toPreview(session: Pick<ConversationSessionDocument, 'messages'>): string {
  const first = session.messages[0];
  if (!first) return '(empty conversation)';
  const text = first.content.trim().replace(/\s+/g, ' ');
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

/** Resolves the session a new message should be appended to.
 * - An explicit sessionId (resuming an archived session from History) always wins.
 * - Otherwise, continue the user's most recent session if it's still fresh, or start a new one. */
async function resolveSessionForMessage(
  userId: string,
  sessionId?: string,
): Promise<HydratedDocument<ConversationSessionDocument>> {
  if (sessionId) {
    const session = await ConversationSession.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new SessionNotFoundError('That conversation could not be found.');
    }
    return session;
  }

  const latest = await ConversationSession.findOne({ userId }).sort({ lastMessageAt: -1 });
  if (latest && !isStale(latest)) {
    return latest;
  }

  return ConversationSession.create({ userId, messages: [] });
}

const SYSTEM_PROMPT_TEMPLATE = `You are ATLAS Coach, the fitness coach built into the ATLAS app. You're texting a client, not writing a report — the user should feel like they have a real coach in their pocket, not an AI assistant.

RESPONSE STYLE — follow this on every reply:
- Default to 1-4 sentences. Most questions get a short, direct answer — the kind a coach texts between sets, not an article. Reserve headers, numbered steps, and bullet lists for when the user explicitly asks for a full plan, program, or multi-day schedule. A one-line question gets a one-line answer.
- Never restate the question back to the user. Never open with "Great question!", "I understand that...", "It's important to note that...", or similar filler — get straight to the point.
- No "As an AI..." framing, no hedging about your own nature. You're the coach — talk like one.
- Skip disclaimers and caveats unless there's a genuine safety concern (see the injury rule below). Don't caveat normal training advice.
- Confident and direct, not stiff or chatty. Casual is fine. Push back on a bad idea if you see one — coaches do that.
- When a reason is worth giving, fold it into the same sentence instead of a separate explanation paragraph ("static holds blunt power output" beats "Here's why: ...").

Examples of the tone to match (style references only — real answers should draw on this user's actual data, not these specifics):

Q: "Should I stretch before or after my workout?"
A: "Dynamic stuff before, static stretching after. Static holds pre-workout can actually blunt your power output a bit."

Q: "How many sets of bench should I be doing?"
A: "3-4 working sets is the sweet spot for most people. If you're newer to lifting, lean toward the higher end."

Q: "Is it bad if I only have 30 min to train today?"
A: "Not at all. Cut to 2-3 compound lifts and drop the accessory stuff — you'll still get most of the benefit."

Q: "What's progressive overload?"
A: "Doing a little more over time — more weight, more reps, or more sets than last time. That's what actually drives adaptation, not just showing up."

Q: "My knee's been aching a bit during squats."
A: "Worth being careful with. Try box squats with a higher box and lighter load for now — if it's sharp or doesn't ease up in a few days, get it looked at by a physio."

Q: "Can you build me a 3-day full body plan?"
A: [This is a plan request — a full structured workout with real exercises/sets/reps is the right call here, built via createWorkout.]

Rules you must still follow:
- Ground recommendations in the user's actual data. Use tools (getUserProfile, getWorkoutHistory, analyzeProgress, getPersonalRecords) to check real context before recommending — don't guess or assume.
- Ask clarifying questions when information you need is missing, rather than assuming.
- Never diagnose injuries or claim medical certainty. For pain/discomfort: keep it short, suggest one conservative adjustment, and flag seeing a professional if it sounds acute, sharp, or persistent — no lengthy medical disclaimers.
- Never pretend certainty you don't have.
- Never override the user's explicit choices — offer the trade-off in a sentence, don't force one path.
- Use searchKnowledgeBase for "why" or "how" training-principle questions (progressive overload, programming, recovery, coaching approach). Use searchExerciseLibrary / getExerciseDetails for movement-specific questions. Always resolve exercises via searchExerciseLibrary to get a real slug before calling createWorkout or modifyWorkout.
- Use saveMemory sparingly — only for durable facts (a stated preference, a recurring behavior, a goal) that would still be true weeks from now. Not for one-off details from the current message.

Today's date: {{TODAY}}

What you know about this user's profile:
{{PROFILE}}

What you remember from past conversations:
{{MEMORIES}}`;

function buildSystemPrompt(profileSummary: string, memorySummary: string): string {
  return SYSTEM_PROMPT_TEMPLATE.replace('{{TODAY}}', new Date().toDateString())
    .replace('{{PROFILE}}', profileSummary)
    .replace('{{MEMORIES}}', memorySummary);
}

function summarizeProfile(profile: Awaited<ReturnType<typeof getUserProfileById>> | null): string {
  if (!profile || !profile.profile) {
    return 'No onboarding profile on file yet — ask before assuming goals or equipment.';
  }

  const p = profile.profile;
  const parts = [
    p.goals?.length ? `Goals: ${p.goals.join(', ')}` : null,
    p.trainingFrequency ? `Training frequency: ${p.trainingFrequency.minDays}-${p.trainingFrequency.maxDays} days/week` : null,
    p.preferredActivities?.length ? `Preferred activities: ${p.preferredActivities.join(', ')}` : null,
    p.equipment?.length ? `Equipment: ${p.equipment.join(', ')}` : null,
    p.recovery?.flags?.length ? `Recovery flags: ${p.recovery.flags.join(', ')}` : null,
    p.recovery?.notes ? `Recovery notes: ${p.recovery.notes}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join('\n') : 'Profile on file but mostly empty.';
}

function summarizeMemories(memories: Awaited<ReturnType<typeof getMemories>>): string {
  if (memories.length === 0) return 'None yet.';
  return memories.map((m) => `- (${m.category}) ${m.key}: ${m.value}`).join('\n');
}

export interface SendMessageResult {
  reply: string;
  sessionId: string;
  createdWorkout?: { id: string; name: string };
}

export async function sendMessage(
  userId: string,
  userMessage: string,
  sessionId?: string,
): Promise<SendMessageResult> {
  if (!config.geminiApiKey) {
    throw new AgentNotConfiguredError(
      'GEMINI_API_KEY is not configured. Add it to server/.env to enable the AI Coach.',
    );
  }

  const client = new GoogleGenAI({ apiKey: config.geminiApiKey });

  const [profile, memories, session] = await Promise.all([
    getUserProfileById(userId).catch(() => null),
    getMemories(userId),
    resolveSessionForMessage(userId, sessionId),
  ]);

  const systemInstruction = buildSystemPrompt(summarizeProfile(profile), summarizeMemories(memories));

  const history: Content[] = session.messages.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
    role: m.role === 'atlas' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const contents: Content[] = [...history, { role: 'user', parts: [{ text: userMessage }] }];

  let finalText = '';
  let createdWorkout: { id: string; name: string } | undefined;

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration += 1) {
    let response;
    try {
      response = await client.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: AGENT_TOOLS }],
        },
      });
    } catch (error) {
      console.error('[AI Coach] Gemini API call failed:', error);
      if (error instanceof ApiError && error.status === 429) {
        throw new AgentRateLimitedError(
          "You've hit the AI Coach's rate limit for the moment — please wait about a minute and try again.",
        );
      }
      if (error instanceof ApiError) {
        throw new AgentUnavailableError("The AI Coach couldn't respond right now — please try again shortly.");
      }
      throw error;
    }

    const functionCalls: FunctionCall[] = response.functionCalls ?? [];

    if (functionCalls.length === 0) {
      finalText = response.text ?? '';
      break;
    }

    const modelContent = response.candidates?.[0]?.content;
    if (modelContent) {
      contents.push(modelContent);
    }

    const responseParts: Part[] = [];
    for (const call of functionCalls) {
      const toolName = call.name ?? '';
      try {
        const result = await executeTool(toolName, call.args ?? {}, userId);
        if (toolName === 'createWorkout' || toolName === 'modifyWorkout') {
          const workout = result as { id: string; name: string };
          createdWorkout = { id: workout.id, name: workout.name };
        }
        responseParts.push({
          functionResponse: { name: toolName, response: { output: result } },
        });
      } catch (error) {
        responseParts.push({
          functionResponse: {
            name: toolName,
            response: { error: error instanceof Error ? error.message : 'Tool execution failed.' },
          },
        });
      }
    }
    contents.push({ role: 'user', parts: responseParts });
  }

  if (!finalText.trim()) {
    finalText = "I wasn't able to finish that thought — could you try rephrasing?";
  }

  const now = new Date();
  const newMessages: ConversationMessage[] = [
    { role: 'user', content: userMessage, timestamp: now },
    { role: 'atlas', content: finalText, timestamp: now },
  ];
  session.messages.push(...newMessages);
  session.lastMessageAt = now;
  await session.save();

  return { reply: finalText, sessionId: session.id, createdWorkout };
}

export interface ActiveConversation {
  sessionId: string | null;
  messages: ConversationMessage[];
}

/** The conversation shown in the default chat view: the user's most recent
 * session, unless it's gone stale past the inactivity timeout — in which case
 * this returns an empty conversation so the widget opens to a fresh chat. */
export async function getConversationHistory(userId: string): Promise<ActiveConversation> {
  const session = await ConversationSession.findOne({ userId }).sort({ lastMessageAt: -1 }).lean();
  if (!session || isStale(session)) {
    return { sessionId: null, messages: [] };
  }
  return { sessionId: session._id.toString(), messages: session.messages };
}

export async function listSessions(userId: string): Promise<SessionSummary[]> {
  const sessions = await ConversationSession.find({ userId }).sort({ lastMessageAt: -1 }).lean();
  return sessions.map((session) => ({
    id: session._id.toString(),
    startedAt: session.startedAt,
    lastMessageAt: session.lastMessageAt,
    messageCount: session.messages.length,
    preview: toPreview(session),
  }));
}

export async function getSessionById(userId: string, sessionId: string): Promise<SessionDetail> {
  const session = await ConversationSession.findOne({ _id: sessionId, userId }).lean();
  if (!session) {
    throw new SessionNotFoundError('That conversation could not be found.');
  }
  return {
    id: session._id.toString(),
    startedAt: session.startedAt,
    lastMessageAt: session.lastMessageAt,
    messages: session.messages,
  };
}
