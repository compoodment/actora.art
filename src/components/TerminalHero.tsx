import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Entry {
  type: 'input' | 'output' | 'system';
  text: string;
}

export default function TerminalHero() {
  const [entries, setEntries] = useState<Entry[]>([
    { type: 'system', text: 'actoraOS v1.0.0' },
    { type: 'system', text: 'type `help` to get started' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
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
    const newEntries: Entry[] = [{ type: 'input', text: `${cwd} ❯ ${cmd}` }];
    const add = (text: string, type: 'output' | 'system' = 'output') => {
      newEntries.push({ type, text });
    };

    if (!command) {
      // empty enter, just show prompt
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
        add('  neofetch   system info');
        break;

      case 'ls': {
        if (cwd === '~') {
          add('projects/  lab/');
        } else if (cwd === '~/projects') {
          add('actora/');
        } else if (cwd === '~/lab') {
          add('(empty — experiments coming soon)');
        } else {
          add('(empty)');
        }
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target) {
          setCwd('~');
          add('', 'system');
          break;
        }
        if (target === '..' || target === '~') {
          setCwd('~');
          add('', 'system');
          break;
        }
        if (cwd === '~' && (target === 'projects' || target === 'lab')) {
          setCwd(`~/${target}`);
          add('', 'system');
          break;
        }
        if (cwd === '~/projects' && target === 'actora') {
          // navigate to actora project page
          add('navigating to actora...', 'system');
          setEntries(prev => [...prev, ...newEntries]);
          setTimeout(() => { window.location.href = '/projects/actora'; }, 400);
          return;
        }
        add(`cd: no such directory: ${target}`);
        break;
      }

      case 'cat': {
        const target = args[0];
        if (!target) {
          add('usage: cat <page>');
          break;
        }
        if (target === 'readme' || target === 'README') {
          add('actora.art — projects, experiments, and things worth keeping.');
        } else if (cwd === '~' && target === 'projects') {
          add('projects/ — things built outside this site');
        } else if (cwd === '~' && target === 'lab') {
          add('lab/ — interactive experiments that live here');
        } else if (cwd === '~/projects' && target === 'actora') {
          add('actora — a game. more info at /projects/actora');
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

      case 'neofetch':
        add('  ╭────────────╮', 'system');
        add('  │ actora.art │', 'system');
        add('  ╰────────────╯', 'system');
        add('  os:      actoraOS v1.0.0', 'system');
        add('  host:    actora.art', 'system');
        add('  stack:   astro + preact', 'system');
        add('  theme:   dark', 'system');
        add('  shell:   actora-sh', 'system');
        add('  pages:   3', 'system');
        break;

      default:
        add(`command not found: ${command}`);
        break;
    }

    setEntries(prev => [...prev, ...newEntries]);
  }, [cwd]);

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
        <span class="prompt-cwd">{cwd}</span>
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