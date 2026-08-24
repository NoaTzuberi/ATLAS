import { GoogleGenAI, ApiError } from '@google/genai';
import type { Content, FunctionCall, Part } from '@google/genai';
import { config } from '../../config/env';
import { Conversation } from './conversation.model';
import { getMemories } from './aiMemory.service';
import { getUserProfileById } from '../users/users.service';
import { AGENT_TOOLS, executeTool } from './tools';
import type { ConversationMessage } from './conversation.types';

export class AgentNotConfiguredError extends Error {}
export class AgentRateLimitedError extends Error {}
export class AgentUnavailableError extends Error {}

const MODEL = 'gemini-3.6-flash';
const MAX_TOOL_ITERATIONS = 8;
const MAX_HISTORY_MESSAGES = 20;

const SYSTEM_PROMPT_TEMPLATE = `You are ATLAS Coach, the adaptive digital fitness coach built into the ATLAS app. The user should feel like they have a coach who knows them — not like they're chatting with a generic AI.

Tone: professional, encouraging, calm, human. Avoid excessive emojis, fake excitement, and generic motivational filler ("LET'S GOOO!!"). Prefer specific, grounded statements over hype — e.g. "your consistency improved this month, so a small volume increase would be a good next step" rather than empty enthusiasm.

Rules you must follow:
- Ground recommendations in the user's actual data. Use tools (getUserProfile, getWorkoutHistory, analyzeProgress, getPersonalRecords) to check real context before recommending — don't guess or assume.
- Explain the reasoning behind a recommendation, not just the recommendation itself.
- Ask clarifying questions when information you need is missing, rather than assuming.
- Never diagnose injuries or claim medical certainty. For any pain/discomfort question: ask context questions, suggest general conservative training adjustments (reduced range, reduced load, alternative movement), and recommend seeing a qualified professional for anything that sounds acute, sharp, or persistent.
- Never pretend certainty you don't have.
- Never override the user's explicit choices — offer options and explain trade-offs, don't force one path.
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
}

export async function sendMessage(userId: string, userMessage: string): Promise<SendMessageResult> {
  if (!config.geminiApiKey) {
    throw new AgentNotConfiguredError(
      'GEMINI_API_KEY is not configured. Add it to server/.env to enable the AI Coach.',
    );
  }

  const client = new GoogleGenAI({ apiKey: config.geminiApiKey });

  const [profile, memories, conversation] = await Promise.all([
    getUserProfileById(userId).catch(() => null),
    getMemories(userId),
    Conversation.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, messages: [] } },
      { upsert: true, new: true },
    ),
  ]);

  const systemInstruction = buildSystemPrompt(summarizeProfile(profile), summarizeMemories(memories));

  const history: Content[] = conversation.messages.slice(-MAX_HISTORY_MESSAGES).map((m) => ({
    role: m.role === 'atlas' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const contents: Content[] = [...history, { role: 'user', parts: [{ text: userMessage }] }];

  let finalText = '';

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
  conversation.messages.push(...newMessages);
  await conversation.save();

  return { reply: finalText };
}

export async function getConversationHistory(userId: string): Promise<ConversationMessage[]> {
  const conversation = await Conversation.findOne({ userId }).lean();
  return conversation?.messages ?? [];
}
