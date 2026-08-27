import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../../services/auth/AuthContext';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { sendMessage, getConversation } from '../../../../services/coach/coachService';
import { workoutTemplatePath } from '../../../../app/config/routes';
import type { ConversationMessage } from '../../types';
import './CoachWidget.css';

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

/** Persistent floating coach chat, mounted once at the app shell so it survives route navigation. */
export function CoachWidget() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || hasLoadedHistory) return;
    setIsLoadingHistory(true);
    getConversation()
      .then(setMessages)
      .catch(() => setError("Couldn't load your conversation history."))
      .finally(() => {
        setIsLoadingHistory(false);
        setHasLoadedHistory(true);
      });
  }, [isOpen, hasLoadedHistory]);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending, isOpen]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError(undefined);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed, timestamp: new Date().toISOString() }]);
    setIsSending(true);

    try {
      const { reply, createdWorkout } = await sendMessage(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: 'atlas', content: reply, timestamp: new Date().toISOString(), createdWorkout },
      ]);
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

  return (
    <div className="coach-widget">
      {isOpen && (
        <div className="coach-widget-panel">
          <div className="coach-widget-header">
            <span className="coach-widget-header-title">Coach</span>
            <button
              type="button"
              className="coach-widget-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close coach"
            >
              &times;
            </button>
          </div>

          <div className="coach-widget-messages" ref={scrollRef}>
            {isLoadingHistory && (
              <div className="coach-widget-loading">
                <Spinner size="md" />
              </div>
            )}

            {!isLoadingHistory && messages.length === 0 && (
              <p className="text-body coach-widget-empty">
                Ask me anything about your training — I can build a workout, explain an exercise, or check how your
                progress is trending.
              </p>
            )}

            {messages.map((message, index) => (
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

          <div className="coach-widget-input-row">
            <textarea
              className="coach-widget-input"
              placeholder="Message your coach..."
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
