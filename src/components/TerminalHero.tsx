import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Entry {
  type: 'input' | 'output' | 'system';
  text: string;
}

const TERMINAL_STORAGE_KEY = 'actora-terminal-state';
const INITIAL_ENTRIES: Entry[] = [
  { type: 'system', text: 'actoraOS v0.1.12' },
  { type: 'system', text: 'type `help` to get started' },
];

// Pages that can be navigated to
const PAGES: Record<string, { description: string; url?: string }> = {
  'projects': {
    description: 'external projects',
    url: '/projects',
  },
  'info': {
    description: 'links and contact',
    url: '/info',
  },
  'chat': {
    description: 'talk to the chat bot',
    url: '/chat',
  },
  'lab': {
    description: 'experiments and web games',
    url: '/lab',
  },
};

// Easter eggs — hidden commands that don't show in help
const EASTER_EGGS: Record<string, string> = {
  'faggot': 'no u',
  'meow': 'meow :3',
  '42': 'the answer to life, the universe, and everything',
  'bitch': 'no u',
};

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
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [entries]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify({ entries }));
  }, [entries]);

  const focus = () => inputRef.current?.focus();

  const processCommand = useCallback((cmd: string) => {
    const raw = cmd.trim();
    const parts = raw.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const newEntries: Entry[] = [{ type: 'input', text: `~ ❯ ${raw}` }];
    const add = (text: string, type: 'output' | 'system' = 'output') => {
      newEntries.push({ type, text });
    };

    if (!raw) {
      setEntries(prev => [...prev, ...newEntries]);
      return;
    }

    // Check easter eggs first (match the full raw input, lowercased)
    const easterEggKey = raw.toLowerCase();
    if (EASTER_EGGS[easterEggKey]) {
      add(EASTER_EGGS[easterEggKey]!);
      setEntries(prev => [...prev, ...newEntries]);
      return;
    }

    switch (command) {
      case 'help':
        add('commands:', 'system');
        add('  ls          list pages');
        add('  cd <page>   go to a page');
        add('  cat <page>  read about a page');
        add('  whoareu     who runs this');
        add('  clear       clear terminal');
        break;

      case 'ls': {
        const names = Object.keys(PAGES);
        if (names.length === 0) {
          add('(nothing here yet)');
        } else {
          add(names.map(n => `${n}/`).join('  '));
        }
        break;
      }

      case 'cd': {
        const target = (args[0] || '').replace(/\/+$/, '').toLowerCase();
        if (!target) {
          add('usage: cd <page>');
          break;
        }
        const page = PAGES[target];
        if (page && page.url) {
          add(`navigating to ${target}...`, 'system');
          setEntries(prev => [...prev, ...newEntries]);
          setTimeout(() => { window.location.href = page.url!; }, 400);
          return;
        }
        if (page) {
          add(`${target}: can't navigate there yet`);
        } else {
          add(`cd: no such page: ${target}`);
        }
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
        } else if (target === 'readme' || target === 'README') {
          add('actora.art — projects, experiments, and things worth keeping.');
        } else {
          add(`cat: ${target}: not found`);
        }
        break;
      }

      case 'whoareu':
        add('computment');
        break;

      case 'clear':
        setEntries(INITIAL_ENTRIES);
        setInput('');
        return;

      default:
        add(`command not found: ${command}`);
        break;
    }

    setEntries(prev => [...prev, ...newEntries]);
  }, []);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const raw = input.trim();
      if (!raw) return;
      processCommand(input);
      setInput('');
    }
  };

  return (
    <div class="terminal" onClick={focus} ref={termRef} role="region" aria-label="actoraOS terminal">
      <div id="terminal-help" class="sr-only">Type help to list available commands in the actora.art terminal.</div>
      <div class="terminal-entries">
        {entries.map((entry, i) => (
          <div key={i} class={`terminal-line terminal-${entry.type}${entry.tone === 'notice' ? ' terminal-note' : ''}`}>
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
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={handleKey}
          class="terminal-input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command"
          aria-describedby="terminal-help"
        />
      </div>
      <div class="terminal-construction-note">this site is under active construction. changes may occur live.</div>
    </div>
  );
}
