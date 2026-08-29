import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../services/auth/AuthContext';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { sendMessage, getConversation, listSessions, getSession } from '../../../../services/coach/coachService';
import { workoutTemplatePath } from '../../../../app/config/routes';
import type { ConversationMessage, SessionSummary } from '../../types';
import './CoachWidget.css';

type View = 'chat' | 'history' | 'session';

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5.5 3C4.67157 3 4 3.67157 4 4.5V14.5C4 15.3284 4.67157 16 5.5 16H6V19.5L10.5 16H18.5C19.3284 16 20 15.3284 20 14.5V4.5C20 3.67157 19.3284 3 18.5 3H5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64M3 12V6m0 6h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatSessionDate(iso: string): string {
  const date = new Date(iso);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
}

function formatSessionTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** Persistent floating coach chat, mounted once at the app shell so it survives route navigation. */
export function CoachWidget() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('chat');

  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [hasLoadedSessions, setHasLoadedSessions] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [viewedSessionId, setViewedSessionId] = useState<string | null>(null);
  const [viewedMessages, setViewedMessages] = useState<ConversationMessage[]>([]);
  const [viewedStartedAt, setViewedStartedAt] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || hasLoadedHistory) return;
    setIsLoadingHistory(true);
    getConversation()
      .then(({ sessionId: activeId, messages: activeMessages }) => {
        setSessionId(activeId);
        setMessages(activeMessages);
      })
      .catch(() => setError("Couldn't load your conversation history."))
      .finally(() => {
        setIsLoadingHistory(false);
        setHasLoadedHistory(true);
      });
  }, [isOpen, hasLoadedHistory]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, viewedMessages, isSending, isOpen, view]);

  function openHistory() {
    setView('history');
    if (hasLoadedSessions) return;
    setIsLoadingSessions(true);
    listSessions()
      .then(setSessions)
      .catch(() => setError("Couldn't load your past conversations."))
      .finally(() => {
        setIsLoadingSessions(false);
        setHasLoadedSessions(true);
      });
  }

  function openSession(summary: SessionSummary) {
    setView('session');
    setViewedSessionId(summary.id);
    setViewedStartedAt(summary.startedAt);
    setViewedMessages([]);
    setIsLoadingSession(true);
    getSession(summary.id)
      .then((detail) => setViewedMessages(detail.messages))
      .catch(() => setError("Couldn't load that conversation."))
      .finally(() => setIsLoadingSession(false));
  }

  function backToChat() {
    setView('chat');
    setError(undefined);
  }

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const isResuming = view === 'session' && viewedSessionId;
    const targetSessionId = isResuming ? viewedSessionId : sessionId ?? undefined;

    setError(undefined);
    setInput('');
    const userTurn: ConversationMessage = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };

    if (isResuming) {
      setViewedMessages((prev) => [...prev, userTurn]);
    } else {
      setMessages((prev) => [...prev, userTurn]);
    }
    setIsSending(true);

    try {
      const { reply, sessionId: resolvedSessionId, createdWorkout } = await sendMessage(trimmed, targetSessionId);
      const atlasTurn: ConversationMessage = {
        role: 'atlas',
        content: reply,
        timestamp: new Date().toISOString(),
        createdWorkout,
      };

      if (isResuming) {
        // Sending into an archived session reactivates it as the current conversation —
        // rebuild `messages` from that session's own history, not the previously-active one.
        setMessages([...viewedMessages, userTurn, atlasTurn]);
        setSessionId(resolvedSessionId);
        setView('chat');
      } else {
        setMessages((prev) => [...prev, atlasTurn]);
        setSessionId(resolvedSessionId);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && typeof err.response?.data?.message === 'string') {
        setError(err.response.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Couldn't reach your coach. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  if (isAuthLoading || !isAuthenticated || !user?.onboardingCompleted) {
    return null;
  }

  const activeMessages = view === 'session' ? viewedMessages : messages;
  const showInput = view === 'chat' || view === 'session';

  return (
    <div className="coach-widget">
      {isOpen && (
        <div className="coach-widget-panel">
          <div className="coach-widget-header">
            {view === 'chat' ? (
              <>
                <span className="coach-widget-header-title">Coach</span>
                <div className="coach-widget-header-actions">
                  <button
                    type="button"
                    className="coach-widget-icon-button"
                    onClick={openHistory}
                    aria-label="View conversation history"
                    title="History"
                  >
                    <HistoryIcon />
                  </button>
                  <button
                    type="button"
                    className="coach-widget-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close coach"
                  >
                    &times;
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="coach-widget-header-actions">
                  <button
                    type="button"
                    className="coach-widget-icon-button"
                    onClick={backToChat}
                    aria-label="Back to current chat"
                    title="Back"
                  >
                    <BackIcon />
                  </button>
                  <span className="coach-widget-header-title">
                    {view === 'history' ? 'History' : viewedStartedAt ? formatSessionDate(viewedStartedAt) : ''}
                  </span>
                </div>
                <button
                  type="button"
                  className="coach-widget-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close coach"
                >
                  &times;
                </button>
              </>
            )}
          </div>

          {view === 'history' ? (
            <div className="coach-history-list">
              {isLoadingSessions && (
                <div className="coach-widget-loading">
                  <Spinner size="md" />
                </div>
              )}

              {!isLoadingSessions && sessions.length === 0 && (
                <p className="text-body coach-widget-empty">No past conversations yet.</p>
              )}

              {!isLoadingSessions &&
                sessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    className="coach-history-item"
                    onClick={() => openSession(session)}
                  >
                    <div className="coach-history-item-meta">
                      <span className="coach-history-item-date">{formatSessionDate(session.lastMessageAt)}</span>
                      <span className="coach-history-item-time">{formatSessionTime(session.lastMessageAt)}</span>
                    </div>
                    <p className="coach-history-item-preview">{session.preview}</p>
                    <span className="coach-history-item-count">
                      {session.messageCount} message{session.messageCount === 1 ? '' : 's'}
                    </span>
                  </button>
                ))}

              {error && <p className="coach-widget-error">{error}</p>}
            </div>
          ) : (
            <div className="coach-widget-messages" ref={scrollRef}>
              {(view === 'chat' ? isLoadingHistory : isLoadingSession) && (
                <div className="coach-widget-loading">
                  <Spinner size="md" />
                </div>
              )}

              {view === 'chat' && !isLoadingHistory && messages.length === 0 && (
                <p className="text-body coach-widget-empty">
                  Ask me anything about your training — I can build a workout, explain an exercise, or check how your
                  progress is trending.
                </p>
              )}

              {(view === 'chat' ? !isLoadingHistory : !isLoadingSession) &&
                activeMessages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      'coach-widget-message' +
                      (message.role === 'user' ? ' coach-widget-message-user' : ' coach-widget-message-atlas')
                    }
                  >
                    {message.role === 'atlas' && <span className="coach-widget-message-label">ATLAS</span>}
                    <p className="coach-widget-message-content">{message.content}</p>
                    {message.createdWorkout && (
                      <Link
                        to={workoutTemplatePath(message.createdWorkout.id)}
                        className="coach-widget-workout-link"
                      >
                        View &quot;{message.createdWorkout.name}&quot; →
                      </Link>
                    )}
                  </div>
                ))}

              {isSending && (
                <div className="coach-widget-message coach-widget-message-atlas">
                  <span className="coach-widget-message-label">ATLAS</span>
                  <div className="coach-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {error && <p className="coach-widget-error">{error}</p>}
            </div>
          )}

          {showInput && (
            <div className="coach-widget-input-row">
              <textarea
                className="coach-widget-input"
                placeholder={view === 'session' ? 'Continue this conversation...' : 'Message your coach...'}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                type="button"
                className="coach-widget-send"
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                aria-label="Send message"
              >
                &uarr;
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="coach-widget-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close coach chat' : 'Open coach chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? <span className="coach-widget-fab-icon">&times;</span> : <ChatIcon />}
      </button>
    </div>
  );
}
