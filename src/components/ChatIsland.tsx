import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import {
  archiveChatSession,
  deleteChatSession,
  fetchChatBootstrap,
  getApiErrorMessage,
  newChatSession,
  renameChatSession,
  resetChatThread,
  selectChatSession,
  sendChatMessage,
  unarchiveChatSession,
  type ChatMessage,
  type ChatModelChoice,
  type ChatReplyResponse,
  type ChatSessionLists,
} from '../lib/api';

const EMPTY_SESSIONS: ChatSessionLists = { active: [], archived: [] };

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value.filter((message): message is ChatMessage => (
    !!message &&
    typeof message === 'object' &&
    ((message as ChatMessage).role === 'user' || (message as ChatMessage).role === 'assistant') &&
    typeof (message as ChatMessage).content === 'string'
  ));
}

function normalizeSessions(value: unknown): ChatSessionLists {
  const data = (value && typeof value === 'object' ? value : {}) as Partial<ChatSessionLists>;
  return {
    active: Array.isArray(data.active) ? data.active : [],
    archived: Array.isArray(data.archived) ? data.archived : [],
  };
}

function formatResetTime(resetAt: number): string {
  const ms = resetAt - Date.now();
  if (ms <= 0) return 'resets soon';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `resets in ${hours}h ${minutes}m`;
  return `resets in ${minutes}m`;
}

function exportText(messages: ChatMessage[]): string {
  return messages.map((message) => `${message.role === 'user' ? 'you' : 'Aurora'}: ${message.content}`).join('\n\n');
}

export default function ChatIsland() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionLists>(EMPTY_SESSIONS);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetAt, setResetAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<ChatModelChoice>('fast');
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [sessionPanelOpen, setSessionPanelOpen] = useState(false);
  const [archivedPanelOpen, setArchivedPanelOpen] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading, currentSessionId]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
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

        const payload = data as { messages?: unknown; signedIn?: boolean; sessions?: unknown; currentSessionId?: string | null; model?: string };
        setMessages(normalizeMessages(payload.messages));
        setSignedIn(!!payload.signedIn);
        setSessions(payload.signedIn ? normalizeSessions(payload.sessions) : EMPTY_SESSIONS);
        setCurrentSessionId(payload.signedIn ? payload.currentSessionId || null : null);
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
      if (!loading) void loadThread();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !loading) void loadThread();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [loadThread, loading]);

  const applySessionResponse = (data: { messages?: unknown; sessions?: ChatSessionLists; currentSessionId?: string | null; model?: string } | null) => {
    if (!data || typeof data !== 'object') return;
    if ('messages' in data) setMessages(normalizeMessages(data.messages));
    if (data.sessions) setSessions(normalizeSessions(data.sessions));
    if ('currentSessionId' in data) setCurrentSessionId(data.currentSessionId || null);
    if (data.model) setModel(data.model === 'gemini-3.1-pro-preview' ? 'smart' : 'fast');
  };

  const resetThread = useCallback(async () => {
    if (loading) return;
    const ok = window.confirm('reset this conversation? Aurora will forget the current context.');
    if (!ok) return;

    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const { response, data } = await resetChatThread();
      if (!response.ok) {
        setError(getApiErrorMessage(data, 'could not reset conversation'));
        return;
      }
      applySessionResponse(data as { messages?: unknown; sessions?: ChatSessionLists; currentSessionId?: string | null });
      setEditPanelOpen(false);
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
    if (!bootstrapped) await loadThread();

    setInput('');
    setError(null);
    setNotice(null);
    setEditPanelOpen(false);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const { response, data } = await sendChatMessage(text, model, currentSessionId);

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
        } else if (errorBody.error === 'minute_limit_reached' || errorBody.error === 'api_rate_limited' || errorBody.error === 'chat_generation_in_flight') {
          const message = errorBody.message || 'something went wrong';
          setError(errorBody.detail ? `${message}\n${errorBody.detail}` : message);
        } else {
          setError(getApiErrorMessage(data, 'something went wrong'));
        }
        setMessages(prev => prev.filter((message, index) => index !== prev.length - 1 || message.content !== text || message.role !== 'user'));
        return;
      }

      const reply = data as ChatReplyResponse;
      setRemaining(reply.remaining);
      setResetAt(reply.resetAt);
      if (reply.sessions) setSessions(normalizeSessions(reply.sessions));
      if (reply.currentSessionId) setCurrentSessionId(reply.currentSessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: reply.reply }]);
    } catch {
      setError('connection failed');
      setMessages(prev => prev.filter((message, index) => index !== prev.length - 1 || message.content !== text || message.role !== 'user'));
    } finally {
      setLoading(false);
    }
  }, [bootstrapped, currentSessionId, input, loadThread, loading, model]);

  const runSessionAction = useCallback(async (action: () => Promise<{ response: Response; data: unknown }>, fallback: string) => {
    if (loading) return;
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const { response, data } = await action();
      if (!response.ok) {
        setError(getApiErrorMessage(data, fallback));
        return;
      }
      applySessionResponse(data as { messages?: unknown; sessions?: ChatSessionLists; currentSessionId?: string | null; model?: string });
      setEditPanelOpen(false);
    } catch {
      setError('connection failed');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const openSession = useCallback(async (sessionId: string, archived = false) => {
    await runSessionAction(() => selectChatSession(sessionId), archived ? 'could not open archived chat' : 'could not open chat');
    setSessionPanelOpen(false);
    setEditPanelOpen(false);
  }, [runSessionAction]);

  const startNewSession = useCallback(async () => {
    await runSessionAction(newChatSession, 'could not start chat');
    setSessionPanelOpen(false);
    setEditPanelOpen(false);
  }, [runSessionAction]);

  const renameCurrent = useCallback(async () => {
    if (!currentSessionId || loading) return;
    const current = sessions.active.find((session) => session.id === currentSessionId);
    const title = window.prompt('rename chat', current?.title || 'new chat');
    if (title === null) return;
    setRenaming(true);
    await runSessionAction(() => renameChatSession(currentSessionId, title), 'could not rename chat');
    setRenaming(false);
  }, [currentSessionId, loading, runSessionAction, sessions.active]);

  const copyChat = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportText(messages));
      setNotice('copied chat');
      setEditPanelOpen(false);
    } catch {
      setError('could not copy chat');
    }
  }, [messages]);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const focusInputFromShell = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, select, textarea, a')) return;
    inputRef.current?.focus();
  };

  const currentSession = sessions.active.find((session) => session.id === currentSessionId) || null;
  const archivedSelected = signedIn && !currentSession && currentSessionId
    ? sessions.archived.find((session) => session.id === currentSessionId) || null
    : null;
  const readOnly = !!archivedSelected;
  const canEdit = !!currentSession || !!archivedSelected || messages.length > 0;

  return (
    <div class={`chat-shell${signedIn ? ' signed-in' : ''}${sessionPanelOpen ? ' chat-panel-open' : ''}`} onClick={focusInputFromShell}>
      {signedIn && (
        <aside class={`chat-sidebar${sessionPanelOpen ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div class="chat-sidebar-head">
            <span class="chat-sidebar-title">chats</span>
            <div class="chat-sidebar-actions">
              <button type="button" class="chat-mini-btn chat-toggle" onClick={() => setSessionPanelOpen(open => !open)} aria-expanded={sessionPanelOpen} aria-label={sessionPanelOpen ? 'hide chats' : 'show chats'}>{sessionPanelOpen ? 'hide' : 'chats'}</button>
              <button type="button" class="chat-mini-btn chat-new" onClick={startNewSession} disabled={loading} aria-label="new chat">{sessionPanelOpen ? 'new' : '+'}</button>
            </div>
          </div>
          <div class="chat-sidebar-body">
            <div class="chat-session-group">
              {sessions.active.length === 0 && <span class="chat-session-empty">none</span>}
              {sessions.active.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  class={`chat-session${session.id === currentSessionId ? ' current' : ''}`}
                  onClick={() => openSession(session.id)}
                  disabled={loading}
                >
                  <span>{session.title || 'new chat'}</span>
                  <small>{session.messageCount}</small>
                </button>
              ))}
            </div>
            {sessions.archived.length > 0 && (
              <div class="chat-session-group archived-group">
                <button type="button" class="chat-archive-toggle" onClick={() => setArchivedPanelOpen(open => !open)} aria-expanded={archivedPanelOpen}>
                  {archivedPanelOpen ? 'hide archived' : `archived (${sessions.archived.length})`}
                </button>
                {archivedPanelOpen && sessions.archived.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    class={`chat-session archived${session.id === currentSessionId ? ' current' : ''}`}
                    onClick={() => openSession(session.id, true)}
                    disabled={loading}
                    title="open archived chat"
                  >
                    <span>{session.title || 'archived chat'}</span>
                    <small>{session.messageCount}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      <div class="chat-container">
        <div class="chat-header">
          <span class="chat-title">{signedIn ? currentSession?.title || archivedSelected?.title || 'new chat' : 'Aurora'}</span>
          <div class="chat-header-actions">
            {remaining !== null && resetAt !== null && (
              <span class="chat-meta">{remaining} left - {formatResetTime(resetAt)}</span>
            )}
            <div class="chat-model-wrap" onClick={(e) => e.stopPropagation()}>
              <button type="button" class="chat-model" onClick={() => { setEditPanelOpen(false); setModelMenuOpen(open => !open); }} disabled={loading || readOnly} aria-expanded={modelMenuOpen} aria-label="chat model">{model}</button>
              {modelMenuOpen && (
                <div class="chat-model-menu" role="menu">
                  {(['fast', 'smart'] as ChatModelChoice[]).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      class={`chat-model-option${model === choice ? ' active' : ''}`}
                      onClick={() => { setModel(choice); setModelMenuOpen(false); }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {canEdit && (
              <div class="chat-edit-wrap" onClick={(e) => e.stopPropagation()}>
                <button type="button" class="chat-edit-toggle" onClick={() => { setModelMenuOpen(false); setEditPanelOpen(open => !open); }} disabled={loading} aria-expanded={editPanelOpen}>edit</button>
                {editPanelOpen && (
                  <div class="chat-edit-menu">
                    {signedIn && currentSession && (
                      <>
                        <button type="button" class="chat-edit-action" onClick={renameCurrent} disabled={loading || renaming}>rename</button>
                        <button type="button" class="chat-edit-action" onClick={() => runSessionAction(() => archiveChatSession(currentSession.id), 'could not archive chat')} disabled={loading}>archive</button>
                        <button type="button" class="chat-edit-action" onClick={() => {
                          if (window.confirm('delete this chat?')) void runSessionAction(() => deleteChatSession(currentSession.id), 'could not delete chat');
                        }} disabled={loading}>delete</button>
                      </>
                    )}
                    {signedIn && archivedSelected && (
                      <>
                        <button type="button" class="chat-edit-action" onClick={() => runSessionAction(() => unarchiveChatSession(archivedSelected.id), 'could not unarchive chat')} disabled={loading}>unarchive</button>
                        <button type="button" class="chat-edit-action" onClick={() => {
                          if (window.confirm('delete this archived chat?')) void runSessionAction(() => deleteChatSession(archivedSelected.id), 'could not delete chat');
                        }} disabled={loading}>delete</button>
                      </>
                    )}
                    {messages.length > 0 && <button type="button" class="chat-edit-action" onClick={copyChat}>copy</button>}
                    {!readOnly && messages.length > 0 && <button type="button" class="chat-edit-action" onClick={resetThread} disabled={loading}>reset</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div class="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text" aria-busy={loading}>
          {messages.length === 0 && (
            <div class="chat-empty">{readOnly ? 'read-only archive' : signedIn ? 'say something' : 'guest chat stays in this browser'}</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} class={`chat-msg chat-${msg.role}`}>
              <span class="chat-msg-label">{msg.role === 'user' ? 'you' : 'Aurora'}</span>
              <span class="chat-msg-text">{msg.content}</span>
            </div>
          ))}
          {loading && (
            <div class="chat-msg chat-assistant">
              <span class="chat-msg-label">Aurora</span>
              <span class="chat-msg-text chat-typing">...</span>
            </div>
          )}
          {notice && (
            <div class="chat-notice" role="status">{notice}</div>
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
            placeholder={readOnly ? 'archived' : loading ? '...' : 'type a message'}
            readOnly={loading || readOnly}
            spellCheck={false}
            autoComplete="off"
            class="chat-input"
            aria-label="Message"
          />
          <button type="button" onClick={send} disabled={loading || readOnly || !input.trim()} class="chat-send" aria-label="Send message">↵</button>
        </div>
      </div>
    </div>
  );
}
