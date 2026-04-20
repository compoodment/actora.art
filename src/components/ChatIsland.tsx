import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_API = '/api/chat';

export default function ChatIsland() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

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

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'rate_limit') {
          setError('daily message limit reached — come back tomorrow');
        } else {
          setError(data.message || 'something went wrong');
        }
        setLoading(false);
        return;
      }

      setSessionId(data.sessionId);
      setRemaining(data.remaining);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('connection failed');
    }

    setLoading(false);
  }, [input, loading, sessionId]);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div class="chat-container">
      <div class="chat-header">
        <span class="chat-title">coda</span>
        {remaining !== null && (
          <span class="chat-remaining">{remaining} left today</span>
        )}
      </div>

      <div class="chat-messages" ref={messagesRef}>
        {messages.length === 0 && (
          <div class="chat-empty">say something</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} class={`chat-msg chat-${msg.role}`}>
            <span class="chat-msg-label">{msg.role === 'user' ? 'you' : 'coda'}</span>
            <span class="chat-msg-text">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div class="chat-msg chat-assistant">
            <span class="chat-msg-label">coda</span>
            <span class="chat-msg-text chat-typing">...</span>
          </div>
        )}
        {error && (
          <div class="chat-error">{error}</div>
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
          disabled={loading}
          spellCheck={false}
          autoComplete="off"
          class="chat-input"
        />
        <button onClick={send} disabled={loading || !input.trim()} class="chat-send">↵</button>
      </div>
    </div>
  );
}