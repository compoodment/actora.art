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
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch balance on mount
  useEffect(() => {
    fetch('/api/balance')
      .then(r => r.json())
      .then(d => setBalance(d.balance))
      .catch(() => {});
  }, []);

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
        if (data.error === 'no_balance') {
          setError('no messages left — earn more by playing the particle game');
          setBalance(0);
        } else {
          setError(data.message || 'something went wrong');
        }
        setLoading(false);
        return;
      }

      setSessionId(data.sessionId);
      setBalance(data.balance);
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

  const isEmpty = balance !== null && balance <= 0;

  return (
    <div class="chat-container" onClick={() => inputRef.current?.focus()}>
      <div class="chat-header">
        <a href="/" class="chat-back">↳ back</a>
        <span class="chat-title">chat bot</span>
        {balance !== null && (
          <span class="chat-meta">
            {isEmpty ? (
              <a href="/lab/particles" class="chat-earn-link">0 messages — earn more</a>
            ) : (
              `${balance} message${balance !== 1 ? 's' : ''}`
            )}
          </span>
        )}
      </div>

      <div class="chat-messages" ref={messagesRef}>
        {messages.length === 0 && (
          <div class="chat-empty">
            {balance === 0
              ? <span>no messages — <a href="/lab/particles">play particles</a> to earn some</span>
              : 'say something'
            }
          </div>
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
          placeholder={loading ? '...' : isEmpty ? 'no messages left' : 'type a message'}
          readOnly={loading || isEmpty}
          spellCheck={false}
          autoComplete="off"
          class="chat-input"
        />
        <button onClick={send} disabled={loading || !input.trim() || isEmpty} class="chat-send">↵</button>
      </div>
    </div>
  );
}