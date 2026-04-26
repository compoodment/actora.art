import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import {
  fetchChatBootstrap,
  getApiErrorMessage,
  resetChatThread,
  sendChatMessage,
  type ChatMessage,
  type ChatModelChoice,
  type ChatReplyResponse,
} from '../lib/api';

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value.filter((message): message is ChatMessage => (
    !!message &&
    typeof message === 'object' &&
    ((message as ChatMessage).role === 'user' || (message as ChatMessage).role === 'assistant') &&
    typeof (message as ChatMessage).content === 'string'
  ));
}

function formatResetTime(resetAt: number): string {
  const ms = resetAt - Date.now();
  if (ms <= 0) return 'resets soon';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `resets in ${hours}h ${minutes}m`;
  return `resets in ${minutes}m`;
}

export default function ChatIsland() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ChatModelChoice>('fast');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadRef = useRef<Promise<void> | null>(null);

  // Keep input focused on mount and after loading finishes
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const loadThread = useCallback(async () => {
    if (loadRef.current) return loadRef.current;

    const request = (async () => {
      try {
        const { response, data } = await fetchChatBootstrap();

        if (!response.ok) {
          setError(getApiErrorMessage(data, 'something went wrong'));
          return;
        }

        const payload = data as { messages?: unknown; model?: string };
        setMessages(normalizeMessages(payload.messages));
        setModel(payload.model === 'gemini-3.1-pro-preview' ? 'smart' : 'fast');
        setError(null);
      } catch {
        // Keep local state as-is if bootstrap fails.
      } finally {
        setBootstrapped(true);
        loadRef.current = null;
      }
    })();

    loadRef.current = request;
    return request;
  }, []);

  useEffect(() => {
    void loadThread();
  }, [loadThread]);

  useEffect(() => {
    const handleFocus = () => {
      if (loading) return;
      void loadThread();
    };
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible' || loading) return;
      void loadThread();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadThread, loading]);

  const resetThread = useCallback(async () => {
    if (loading) return;
    const ok = window.confirm('reset this conversation? the bot will forget the current context.');
    if (!ok) return;

    setError(null);
    setLoading(true);
    try {
      const { response, data } = await resetChatThread();
      if (!response.ok) {
        setError(getApiErrorMessage(data, 'could not reset conversation'));
        return;
      }
      setMessages([]);
      setBootstrapped(true);
    } catch {
      setError('connection failed');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!bootstrapped) {
      await loadThread();
    }

    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const { response, data } = await sendChatMessage(text, model);

      if (!response.ok) {
        const errorBody = (data && typeof data === 'object' ? data : {}) as {
          error?: string;
          message?: string;
          detail?: string;
          resetAt?: number;
        };

        if (errorBody.error === 'daily_limit_reached') {
          setError(getApiErrorMessage(data, 'daily limit reached'));
          setRemaining(0);
          setResetAt(typeof errorBody.resetAt === 'number' ? errorBody.resetAt : null);
        } else if (errorBody.error === 'minute_limit_reached' || errorBody.error === 'api_rate_limited') {
          const message = errorBody.message || 'something went wrong';
          setError(errorBody.detail ? `${message}\n${errorBody.detail}` : message);
        } else {
          setError(getApiErrorMessage(data, 'something went wrong'));
        }
        setLoading(false);
        return;
      }

      const reply = data as ChatReplyResponse;
      setRemaining(reply.remaining);
      setResetAt(reply.resetAt);
      setMessages(prev => [...prev, { role: 'assistant', content: reply.reply }]);
    } catch {
      setError('connection failed');
    }

    setLoading(false);
  }, [bootstrapped, input, loadThread, loading, model]);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const focusInputFromShell = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, select, textarea, a')) return;
    inputRef.current?.focus();
  };

  return (
    <div class="chat-container" onClick={focusInputFromShell}>
      <div class="chat-header">
        <span class="chat-title">chat bot</span>
        <div class="chat-header-actions">
          {remaining !== null && resetAt !== null && (
            <span class="chat-meta">{remaining} left — {formatResetTime(resetAt)}</span>
          )}
          <select class="chat-model" value={model} onClick={(e) => e.stopPropagation()} onChange={(e) => setModel((e.target as HTMLSelectElement).value as ChatModelChoice)} disabled={loading} aria-label="chat model">
            <option value="fast">fast</option>
            <option value="smart">smart</option>
          </select>
          <button type="button" class="chat-reset" onClick={resetThread} disabled={loading || messages.length === 0}>reset</button>
        </div>
      </div>

      <div class="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text" aria-busy={loading}>
        {messages.length === 0 && (
          <div class="chat-empty">say something</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} class={`chat-msg chat-${msg.role}`}>
            <span class="chat-msg-label">{msg.role === 'user' ? 'you' : 'bot'}</span>
            <span class="chat-msg-text">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div class="chat-msg chat-assistant">
            <span class="chat-msg-label">bot</span>
            <span class="chat-msg-text chat-typing">...</span>
          </div>
        )}
        {error && (
          <div class="chat-error" role="alert">{error}</div>
        )}
      </div>

      <div class="chat-input-bar">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={handleKey}
          placeholder={loading ? '...' : 'type a message'}
          readOnly={loading}
          spellCheck={false}
          autoComplete="off"
          class="chat-input"
          aria-label="Message"
        />
        <button type="button" onClick={send} disabled={loading || !input.trim()} class="chat-send" aria-label="Send message">↵</button>
      </div>
    </div>
  );
}
