import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import {
  emitAuthChange,
  fetchAuthSession,
  normalizeAuthSession,
  type AuthSession,
} from '../lib/auth';
import {
  getErrorMessage,
  normalizeCreationOptions,
  normalizeRequestOptions,
  serializeCredential,
} from '../lib/webauthn';

interface Entry {
  type: 'input' | 'output' | 'system';
  text: string;
}

interface ApiErrorShape {
  error?: string;
  message?: string;
  detail?: string;
}

type PromptState =
  | { kind: 'register-username' }
  | { kind: 'register-display-name'; username: string };

const TERMINAL_STORAGE_KEY = 'actora-terminal-state';
const INITIAL_ENTRIES: Entry[] = [
  { type: 'system', text: 'actoraOS v0.1.15' },
  { type: 'system', text: 'type `help` to get started' },
];

const GUEST_SESSION: AuthSession = {
  signedIn: false,
  username: null,
  displayName: null,
};

const PAGES: Record<string, { description: string; url?: string }> = {
  projects: {
    description: 'external projects',
    url: '/projects',
  },
  info: {
    description: 'links and contact',
    url: '/info',
  },
  chat: {
    description: 'talk to the chat bot',
    url: '/chat',
  },
  lab: {
    description: 'experiments and web games',
    url: '/lab',
  },
  account: {
    description: 'account settings and passkeys',
    url: '/account',
  },
};

const EASTER_EGGS: Record<string, string> = {
  faggot: 'no u',
  meow: 'meow :3',
  '42': 'the answer to life, the universe, and everything',
  bitch: 'no u',
};

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function getApiErrorMessage(payload: unknown, fallback: string): string {
  const data = (payload && typeof payload === 'object' ? payload : {}) as ApiErrorShape;
  return data.detail || data.message || data.error || fallback;
}

function requireWebAuthnSupport(): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    throw new Error('Passkeys are only available in the browser.');
  }
  if (!window.PublicKeyCredential || !navigator.credentials) {
    throw new Error('This browser does not support passkeys.');
  }
}

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

  const focus = () => inputRef.current?.focus();

  const appendEntries = useCallback((nextEntries: Entry[]) => {
    setEntries((previous) => [...previous, ...nextEntries]);
  }, []);

  const submitCredential = useCallback(async (path: string, credential: PublicKeyCredential) => {
    const payload = serializeCredential(credential);
    const response = await fetch(path, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        credential: payload,
      }),
    });
    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, 'Authentication failed.'));
    }
    return data;
  }, []);

  const runLogin = useCallback(async () => {
    if (busy) {
      appendEntries([{ type: 'system', text: '> Authentication already in progress.' }]);
      return;
    }

    setBusy(true);
    appendEntries([{ type: 'system', text: '> Waiting for security key / biometric approval...' }]);

    try {
      requireWebAuthnSupport();

      const startResponse = await fetch('/api/auth/passkey/login/start', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const startPayload = await readJsonResponse(startResponse);
      if (!startResponse.ok) {
        throw new Error(getApiErrorMessage(startPayload, 'Unable to start passkey login.'));
      }

      const credential = await navigator.credentials.get(normalizeRequestOptions(startPayload));
      if (!(credential instanceof PublicKeyCredential)) {
        throw new Error('Passkey login was cancelled.');
      }

      const finishPayload = await submitCredential('/api/auth/passkey/login/finish', credential);
      const session = normalizeAuthSession(finishPayload);
      const nextSession = session.signedIn ? session : await fetchAuthSession();

      setAuthSession(nextSession);
      emitAuthChange(nextSession);
      appendEntries([
        {
          type: 'system',
          text: nextSession.signedIn && nextSession.username
            ? `> Logged in as @${nextSession.username}.`
            : '> Login complete.',
        },
      ]);
    } catch (error) {
      appendEntries([
        {
          type: 'output',
          text: `Login failed. ${getErrorMessage(error, 'Try again.')}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }, [appendEntries, busy, submitCredential]);

  const runRegister = useCallback(async (username: string, displayName: string) => {
    if (busy) {
      appendEntries([{ type: 'system', text: '> Authentication already in progress.' }]);
      return;
    }

    setBusy(true);
    appendEntries([{ type: 'system', text: '> Waiting for security key...' }]);

    try {
      requireWebAuthnSupport();

      const startResponse = await fetch('/api/auth/passkey/register/start', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          displayName,
        }),
      });
      const startPayload = await readJsonResponse(startResponse);
      if (!startResponse.ok) {
        throw new Error(getApiErrorMessage(startPayload, 'Unable to start passkey registration.'));
      }

      const credential = await navigator.credentials.create(normalizeCreationOptions(startPayload));
      if (!(credential instanceof PublicKeyCredential)) {
        throw new Error('Passkey registration was cancelled.');
      }

      const finishPayload = await submitCredential('/api/auth/passkey/register/finish', credential);
      const session = normalizeAuthSession(finishPayload);
      const nextSession = session.signedIn ? session : await fetchAuthSession();

      setAuthSession(nextSession);
      emitAuthChange(nextSession);
      appendEntries([
        {
          type: 'system',
          text: nextSession.signedIn && nextSession.username
            ? `> Registered and signed in as @${nextSession.username}.`
            : '> Registration complete.',
        },
      ]);
    } catch (error) {
      appendEntries([
        {
          type: 'output',
          text: `Register failed. ${getErrorMessage(error, 'Try again.')}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }, [appendEntries, busy, submitCredential]);

  const processCommand = useCallback(async (cmd: string) => {
    const raw = cmd.trim();
    if (!raw) {
      appendEntries([{ type: 'input', text: '~ ❯ ' }]);
      return;
    }

    const parts = raw.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const newEntries: Entry[] = [{ type: 'input', text: `~ ❯ ${raw}` }];
    const add = (text: string, type: Entry['type'] = 'output') => {
      newEntries.push({ type, text });
    };

    const easterEggKey = raw.toLowerCase();
    if (EASTER_EGGS[easterEggKey]) {
      add(EASTER_EGGS[easterEggKey]!);
      appendEntries(newEntries);
      return;
    }

    switch (command) {
      case 'help':
        add('commands:', 'system');
        add('  ls              list pages');
        add('  cd <page>       go to a page');
        add('  cat <page>      read about a page');
        add('  register        create an account with a passkey');
        add('  login           sign in with a passkey');
        add('  whoareu         who runs this');
        add('  clear           clear terminal');
        break;

      case 'ls': {
        const names = Object.keys(PAGES);
        add(names.map((name) => `${name}/`).join('  '));
        break;
      }

      case 'cd': {
        const target = (args[0] || '').replace(/\/+$/, '').toLowerCase();
        if (!target) {
          add('usage: cd <page>');
          break;
        }

        if (target === 'account') {
          const session = await fetchAuthSession();
          setAuthSession(session);
          emitAuthChange(session);
          if (!session.signedIn) {
            add("Access denied. Please type 'login' or 'register' first.");
            break;
          }
          add('navigating to account...', 'system');
          appendEntries(newEntries);
          window.setTimeout(() => {
            window.location.href = '/account';
          }, 250);
          return;
        }

        const page = PAGES[target];
        if (page?.url) {
          add(`navigating to ${target}...`, 'system');
          appendEntries(newEntries);
          window.setTimeout(() => {
            window.location.href = page.url!;
          }, 250);
          return;
        }

        add(page ? `${target}: can't navigate there yet` : `cd: no such page: ${target}`);
        break;
      }

      case 'cat': {
        const target = args[0] ? args[0].toLowerCase() : '';
        if (!target) {
          add('usage: cat <page>');
          break;
        }
        const page = PAGES[target];
        if (page) {
          add(page.description);
        } else if (target === 'readme') {
          add('actora.art — projects, experiments, and things worth keeping.');
        } else {
          add(`cat: ${target}: not found`);
        }
        break;
      }

      case 'login':
        appendEntries(newEntries);
        await runLogin();
        return;

      case 'register':
        add('Enter username:', 'system');
        appendEntries(newEntries);
        setPromptState({ kind: 'register-username' });
        return;

      case 'whoareu':
        add('computment');
        break;

      case 'clear':
        setEntries(INITIAL_ENTRIES);
        setPromptState(null);
        setInput('');
        return;

      default:
        add(`command not found: ${command}`);
        break;
    }

    appendEntries(newEntries);
  }, [appendEntries, authSession, runLogin]);

  const handlePromptInput = useCallback(async (rawValue: string) => {
    const value = rawValue.trim();
    const nextEntries: Entry[] = [{ type: 'input', text: `~ ❯ ${rawValue}` }];

    if (promptState?.kind === 'register-username') {
      if (!value) {
        nextEntries.push({ type: 'output', text: 'Username cannot be empty.' });
        nextEntries.push({ type: 'system', text: 'Enter username:' });
        appendEntries(nextEntries);
        return;
      }

      appendEntries(nextEntries);
      setPromptState({ kind: 'register-display-name', username: value });
      appendEntries([{ type: 'system', text: 'Enter display name:' }]);
      return;
    }

    if (promptState?.kind === 'register-display-name') {
      if (!value) {
        nextEntries.push({ type: 'output', text: 'Display name cannot be empty.' });
        nextEntries.push({ type: 'system', text: 'Enter display name:' });
        appendEntries(nextEntries);
        return;
      }

      appendEntries(nextEntries);
      setPromptState(null);
      await runRegister(promptState.username, value);
    }
  }, [appendEntries, promptState, runRegister]);

  const handleKey = async (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;

    const raw = input;
    if (!raw.trim()) return;

    setInput('');

    if (promptState) {
      await handlePromptInput(raw);
      return;
    }

    await processCommand(raw);
  };

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
          onInput={(event) => setInput((event.target as HTMLInputElement).value)}
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
      <div class="terminal-construction-note">this site is under active construction. changes may occur live.</div>
    </div>
  );
}
