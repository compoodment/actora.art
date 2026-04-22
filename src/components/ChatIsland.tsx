import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_API = '/api/chat';
const GUEST_CHAT_HANDLE_STORAGE_KEY = 'actora.chat.guestThread';

interface ChatPayload {
  messages?: Message[];
  reply?: string;
  sessionId?: string | null;
  signedIn?: boolean;
  remaining?: number;
  resetAt?: number;
  error?: string;
  message?: string;
  detail?: string;
}

function readStoredGuestHandle(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(GUEST_CHAT_HANDLE_STORAGE_KEY);
}

function normalizeMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) return [];
  return value.filter((message): message is Message => (
    !!message &&
    typeof message === 'object' &&
    ((message as Message).role === 'user' || (message as Message).role === 'assistant') &&
    typeof (message as Message).content === 'string'
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => readStoredGuestHandle());
  const [bootstrapped, setBootstrapped] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const syncGuestHandle = useCallback((nextSessionId: string | null, signedIn: boolean) => {
    if (typeof window === 'undefined') return;
    if (!nextSessionId || signedIn || !nextSessionId.startsWith('guest:')) {
      window.localStorage.removeItem(GUEST_CHAT_HANDLE_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(GUEST_CHAT_HANDLE_STORAGE_KEY, nextSessionId);
  }, []);

  const loadThread = useCallback(async () => {
    if (loadRef.current) return loadRef.current;

    const request = (async () => {
      try {
        const res = await fetch(CHAT_API);
        const data = await res.json() as ChatPayload;

        if (!res.ok) {
          setError(data.message || 'something went wrong');
          return;
        }

        setMessages(normalizeMessages(data.messages));
        setSessionId(data.sessionId ?? null);
        syncGuestHandle(data.sessionId ?? null, data.signedIn === true);
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
  }, [syncGuestHandle]);

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
      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });

      const data = await res.json() as ChatPayload;

      if (!res.ok) {
        if (data.error === 'daily_limit_reached') {
          setError(data.message || 'daily limit reached');
          setRemaining(0);
          setResetAt(typeof data.resetAt === 'number' ? data.resetAt : null);
        } else if (data.error === 'minute_limit_reached' || data.error === 'api_rate_limited') {
          const message = data.message || 'something went wrong';
          setError(data.detail ? `${message}
${data.detail}` : message);
        } else {
          setError(data.message || 'something went wrong');
        }
        setLoading(false);
        return;
      }

      setSessionId(data.sessionId ?? null);
      syncGuestHandle(data.sessionId ?? null, data.signedIn === true);
      setRemaining(typeof data.remaining === 'number' ? data.remaining : null);
      setResetAt(typeof data.resetAt === 'number' ? data.resetAt : null);
      setMessages(prev => [...prev, { role: 'assistant', content: typeof data.reply === 'string' ? data.reply : '...' }]);
    } catch {
      setError('connection failed');
    }

    setLoading(false);
  }, [bootstrapped, input, loadThread, loading, sessionId, syncGuestHandle]);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div class="chat-container" onClick={() => inputRef.current?.focus()}>
      <div class="chat-header">
        <a href="/" class="chat-back">↳ back</a>
        <span class="chat-title">chat bot</span>
        {remaining !== null && resetAt !== null && (
          <span class="chat-meta">{remaining} left — {formatResetTime(resetAt)}</span>
        )}
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
