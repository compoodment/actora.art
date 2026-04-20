import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Entry {
  type: 'input' | 'output' | 'system';
  text: string;
}

// Pages that can be navigated to
const PAGES: Record<string, { description: string; url?: string }> = {
  'actora': {
    description: 'a game',
    url: '/projects/actora',
  },
};

export default function TerminalHero() {
  const [entries, setEntries] = useState<Entry[]>([
    { type: 'system', text: 'actoraOS v1.0.0' },
    { type: 'system', text: 'type `help` to get started' },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [entries]);

  const focus = () => inputRef.current?.focus();

  const processCommand = useCallback((cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    const newEntries: Entry[] = [{ type: 'input', text: `~ ❯ ${cmd}` }];
    const add = (text: string, type: 'output' | 'system' = 'output') => {
      newEntries.push({ type, text });
    };

    if (!command) {
      setEntries(prev => [...prev, ...newEntries]);
      return;
    }

    switch (command) {
      case 'help':
        add('commands:', 'system');
        add('  ls        list pages');
        add('  cd <page>  go to a page');
        add('  cat <page> read about a page');
        add('  whoareu    who runs this');
        add('  clear      clear terminal');
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
        const target = args[0];
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
        const target = args[0];
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
        setEntries([]);
        return;

      default:
        add(`command not found: ${command}`);
        break;
    }

    setEntries(prev => [...prev, ...newEntries]);
  }, []);

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    }
  };

  return (
    <div class="terminal" onClick={focus} ref={termRef}>
      <div class="terminal-entries">
        {entries.map((entry, i) => (
          <div key={i} class={`terminal-line terminal-${entry.type}`}>
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
        />
      </div>
    </div>
  );
}