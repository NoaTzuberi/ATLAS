import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { PageLayout } from '../../../../components/layout/PageLayout/PageLayout';
import { Container } from '../../../../components/layout/Container/Container';
import { Section } from '../../../../components/layout/Section/Section';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { Spinner } from '../../../../components/common/Spinner/Spinner';
import { sendMessage, getConversation } from '../../../../services/coach/coachService';
import type { ConversationMessage } from '../../types';
import './CoachPage.css';

export function CoachPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConversation()
      .then(setMessages)
      .catch(() => setError("Couldn't load your conversation history."))
      .finally(() => setIsLoadingHistory(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError(undefined);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed, timestamp: new Date().toISOString() }]);
    setIsSending(true);

    try {
      const { reply } = await sendMessage(trimmed);
      setMessages((prev) => [...prev, { role: 'atlas', content: reply, timestamp: new Date().toISOString() }]);
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <PageLayout>
      <Section className="coach-page">
        <Container>
          <div className="coach-header">
            <h1 className="coach-title">Coach</h1>
            <p className="text-body coach-subtitle">Ask about your training, exercises, or progress.</p>
          </div>

          <GlassCard className="coach-panel">
            <div className="coach-messages" ref={scrollRef}>
              {isLoadingHistory && (
                <div className="coach-loading">
                  <Spinner size="lg" />
                </div>
              )}

              {!isLoadingHistory && messages.length === 0 && (
                <div className="coach-empty">
                  <p className="text-body">
                    Ask me anything about your training — I can build a workout, explain an exercise, or check how
                    your progress is trending.
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={'coach-message' + (message.role === 'user' ? ' coach-message-user' : ' coach-message-atlas')}
                >
                  {message.role === 'atlas' && <span className="coach-message-label">ATLAS</span>}
                  <p className="coach-message-content">{message.content}</p>
                </div>
              ))}

              {isSending && (
                <div className="coach-message coach-message-atlas coach-message-typing">
                  <span className="coach-message-label">ATLAS</span>
                  <div className="coach-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}

              {error && <p className="coach-error">{error}</p>}
            </div>

            <div className="coach-input-row">
              <textarea
                className="coach-input"
                placeholder="Message your coach..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                type="button"
                className="coach-send-button"
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                aria-label="Send message"
              >
                &uarr;
              </button>
            </div>
          </GlassCard>
        </Container>
      </Section>
    </PageLayout>
  );
}
