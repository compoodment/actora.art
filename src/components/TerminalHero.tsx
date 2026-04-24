import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { emitAuthChange, fetchAuthSession, type AuthSession } from '../lib/auth';
import { ACTORA_OS_VERSION } from '../lib/version';
import { processCommand, type Entry } from '../lib/terminal-commands';
import { GUEST_SESSION, runLoginFlow, runLogoutFlow, runRegisterFlow } from '../lib/terminal-auth';

type PromptState =
  | { kind: 'register-username' }
  | { kind: 'register-display-name'; username: string };

const TERMINAL_STORAGE_KEY = 'actora-terminal-state';
const INITIAL_ENTRIES: Entry[] = [
  { type: 'system', text: `actoraOS v${ACTORA_OS_VERSION}` },
  { type: 'system', text: 'type `help` to get started' },
];

export default function TerminalHero() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ENTRIES;
    const navType = window.performance.getEntriesByType('navigation')[0]?.type;
    if (navType === 'reload') return INITIAL_ENTRIES;
    try {
      const raw = window.sessionStorage.getItem(TERMINAL_STORAGE_KEY);
      if (!raw) return INITIAL_ENTRIES;
      const parsed = JSON.parse(raw) as { entries?: Entry[] };
      return Array.isArray(parsed.entries) && parsed.entries.length > 0 ? parsed.entries : INITIAL_ENTRIES;
    } catch {
      return INITIAL_ENTRIES;
    }
  });
  const [input, setInput] = useState('');
  const [authSession, setAuthSession] = useState<AuthSession>(GUEST_SESSION);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [registerCtrlCCancelArmed, setRegisterCtrlCCancelArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    void fetchAuthSession().then(setAuthSession);
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [entries]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify({ entries }));
  }, [entries]);

  useEffect(() => {
    if (!promptState) {
      setRegisterCtrlCCancelArmed(false);
    }
  }, [promptState]);

  const focus = () => inputRef.current?.focus();

  const appendEntries = useCallback((nextEntries: Entry[]) => {
    setEntries((previous) => [...previous, ...nextEntries]);
  }, []);

  const cancelRegistrationPrompt = useCallback(() => {
    setPromptState(null);
    setRegisterCtrlCCancelArmed(false);
    setInput('');
    appendEntries([{ type: 'output', text: 'registration cancelled.' }]);
  }, [appendEntries]);

  const authCallbacks = { setBusy, appendEntries, setAuthSession };

  const runLogin = useCallback(async () => {
    if (busy) {
      appendEntries([{ type: 'system', text: '> Authentication already in progress.' }]);
      return;
    }
    await runLoginFlow(authCallbacks);
  }, [authCallbacks, busy, appendEntries]);

  const runRegister = useCallback(async (username: string, displayName: string) => {
    if (busy) {
      appendEntries([{ type: 'system', text: '> Authentication already in progress.' }]);
      return;
    }
    await runRegisterFlow(username, displayName, authCallbacks);
  }, [authCallbacks, busy, appendEntries]);

  const runLogout = useCallback(async () => {
    if (busy) {
      appendEntries([{ type: 'system', text: '> Authentication already in progress.' }]);
      return;
    }
    await runLogoutFlow(authCallbacks);
  }, [authCallbacks, busy, appendEntries]);

  const handleCommand = useCallback(async (cmd: string) => {
    const raw = cmd.trim();
    if (!raw) {
      appendEntries([{ type: 'input', text: '~ ❯ ' }]);
      return;
    }

    const command = raw.split(/\s+/)[0].toLowerCase();
    
    // Check if this is an auth command that TerminalHero needs to handle
    if (command === 'login') {
      appendEntries([{ type: 'input', text: `~ ❯ ${raw}` }]);
      await runLogin();
      return;
    }
    if (command === 'logout') {
      appendEntries([{ type: 'input', text: `~ ❯ ${raw}` }]);
      await runLogout();
      return;
    }
    if (command === 'register') {
      const newEntries: Entry[] = [
        { type: 'input', text: `~ ❯ ${raw}` },
        { type: 'system', text: 'enter username:' }
      ];
      appendEntries(newEntries);
      setRegisterCtrlCCancelArmed(false);
      setPromptState({ kind: 'register-username' });
      return;
    }

    // Process generic commands
    const result = processCommand(raw);
    if (!result) return; // Unhandled auth command

    if (result.handled && result.entries.length === 0) {
      // Clear command
      setEntries(INITIAL_ENTRIES);
      setPromptState(null);
      setRegisterCtrlCCancelArmed(false);
      setInput('');
      return;
    }

    if (result.navigate) {
      if (result.navigate === '/account') {
        const session = await fetchAuthSession();
        setAuthSession(session);
        emitAuthChange(session);
        if (!session.signedIn) {
          result.entries.push({ type: 'output', text: "access denied. please type 'login' or 'register' first." });
          appendEntries(result.entries);
          return;
        }
      }
      
      appendEntries(result.entries);
      window.setTimeout(() => {
        window.location.href = result.navigate!;
      }, 250);
      return;
    }

    appendEntries(result.entries);
  }, [appendEntries, runLogin, runLogout]);

  const handlePromptInput = useCallback(async (rawValue: string) => {
    const value = rawValue.trim();
    const nextEntries: Entry[] = [{ type: 'input', text: `~ ❯ ${rawValue}` }];

    if (promptState?.kind === 'register-username') {
      if (!value) {
        nextEntries.push({ type: 'output', text: 'username cannot be empty.' });
        nextEntries.push({ type: 'system', text: 'enter username:' });
        appendEntries(nextEntries);
        return;
      }

      appendEntries(nextEntries);
      setPromptState({ kind: 'register-display-name', username: value });
      appendEntries([{ type: 'system', text: 'enter display name:' }]);
      return;
    }

    if (promptState?.kind === 'register-display-name') {
      if (!value) {
        nextEntries.push({ type: 'output', text: 'display name cannot be empty.' });
        nextEntries.push({ type: 'system', text: 'enter display name:' });
        appendEntries(nextEntries);
        return;
      }

      appendEntries(nextEntries);
      setPromptState(null);
      await runRegister(promptState.username, value);
    }
  }, [appendEntries, promptState, runRegister]);

  const handleKey = async (event: KeyboardEvent) => {
    if (promptState && event.key.toLowerCase() === 'c' && event.ctrlKey) {
      event.preventDefault();
      if (registerCtrlCCancelArmed) {
        cancelRegistrationPrompt();
        return;
      }
      setRegisterCtrlCCancelArmed(true);
      return;
    }

    if (event.key !== 'Enter') return;

    const raw = input;
    if (!raw.trim()) return;

    setInput('');

    if (promptState) {
      await handlePromptInput(raw);
      return;
    }

    await handleCommand(raw);
  };

  const cancelHint = registerCtrlCCancelArmed
    ? 'press ctrl+c again to cancel registration.'
    : 'ctrl+c twice cancels registration.';

  return (
    <div class="terminal" onClick={focus} ref={termRef} role="region" aria-label="actoraOS terminal">
      <div id="terminal-help" class="sr-only">Type help to list available commands in the actora.art terminal.</div>
      <div class="terminal-entries">
        {entries.map((entry, index) => (
          <div key={index} class={`terminal-line terminal-${entry.type}`}>
            {entry.text}
          </div>
        ))}
      </div>
      <div class="terminal-prompt">
        <span class="prompt-cwd">~</span>
        <span class="prompt-symbol"> ❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onInput={(event) => {
            if (registerCtrlCCancelArmed) {
              setRegisterCtrlCCancelArmed(false);
            }
            setInput((event.target as HTMLInputElement).value);
          }}
          onKeyDown={handleKey}
          class="terminal-input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label={promptState ? 'Terminal prompt input' : 'Terminal command'}
          aria-describedby="terminal-help"
          disabled={busy}
        />
      </div>
      <div class="terminal-notes">
        {promptState ? <div class="terminal-cancel-hint">{cancelHint}</div> : null}
        <div class="terminal-construction-note">this site is under active construction. changes may occur live.</div>
      </div>
    </div>
  );
}
