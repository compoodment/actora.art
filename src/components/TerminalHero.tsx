import { useEffect, useRef, useState, useCallback } from 'preact/hooks';

interface Entry {
  type: 'input' | 'output' | 'system' | 'hidden';
  text: string;
}

// Pages that can be navigated to
const PAGES: Record<string, { description: string; url?: string }> = {
  'actora': {
    description: 'a game',
    url: '/projects/actora',
  },
};

// Easter eggs — these are hidden commands that don't show in help
const EASTER_EGGS: Record<string, string> = {
  'sudo': 'nice try',
  'rm -rf /': 'not today',
  'exit': 'you can\'t leave',
  'quit': 'you can\'t leave',
  'hello': 'hi :)',
  'fuck': 'no u',
  'faggot': 'no u',
  'shit': 'no u',
  'asshole': 'no u',
  'bitch': 'no u',
  'damn': 'no u',
  'pls': 'pls what?',
  'please': 'please what?',
  'help me': 'that\'s just `help`',
  'bye': 'you can\'t leave',
  'love': '<3',
  'thanks': '<3',
  'thank you': '<3',
  'ty': '<3',
  'hi': 'hi :)',
  'hey': 'hi :)',
  'sup': 'sup :)',
  'yo': 'sup :)',
  'good morning': 'good morning :)',
  'good night': 'good night :)',
  'goodnight': 'good night :)',
  'goodmorning': 'good morning :)',
  'whoami': 'who are you?',
  'pwd': '/home/you',
  'date': new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  'time': new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  'uname': 'actoraOS 1.0.0',
  'uptime': 'since the beginning',
  'hostname': 'actora.art',
  'ping': 'pong!',
  'cowsay': 'moo',
  'meow': 'meow :3',
  'cat': 'meow :3',
  'dog': 'woof',
  'woof': 'woof :)',
  'snake': 'hisssss',
  '42': 'the answer to life, the universe, and everything',
  '666': 'nice try',
  '69': 'nice',
  '420': 'blaze it',
  'math': '2 + 2 = 5 (for sufficiently large values of 2)',
  'make me a sandwich': 'make it yourself',
  'sudo make me a sandwich': 'okay, here\'s a sandwich 🥪',
  'nano': 'vim or nothing',
  'vim': ':wq',
  'emacs': 'nice try',
  'nano vim': 'choose one',
  'rust': '🦀',
  'python': '🐍',
  'javascript': 'don\'t',
  'java': 'no',
  'c++': 'segmentation fault',
  'css': 'centering a div',
  'html': '<no>',
  'windows': 'have you tried turning it off and on again?',
  'linux': 'i use arch btw',
  'arch': 'i use arch btw',
  'macos': 'it just works',
  'git': 'push --force with care',
  'npm': 'installing dependencies... just kidding',
  'cargo': 'compiling the universe',
  'docker': 'works on my machine',
  'kubernetes': 'overkill',
  'coffee': '☕',
  'tea': '🍵',
  'beer': '🍺',
  'pizza': '🍕',
  'music': '🎵',
  'sleep': 'z z z',
  'cry': ':(',
  'lol': 'lol',
  'lmao': 'lmao',
  'brb': 'take your time',
  'idk': 'me neither',
  'why': 'why not?',
  'how': 'very carefully',
  'what': 'what what?',
  'where': 'here',
  'when': 'now',
  'who': 'computment',
  'am i real': 'as real as this terminal',
  'are you real': 'as real as you want me to be',
  'matrix': '🟢🟢🟢 follow the white rabbit',
  'nintendo': 'a delayed game is eventually good, but a rushed game is forever bad — shigeru miyamoto',
  'konami': '⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️',
  'doom': 'rip and tear',
  'minecraft': '🧱 mine 🧱 craft 🧱',
  'among us': 'ඞ sus',
  'sus': 'ඞ',
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
    const raw = cmd.trim();
    const parts = raw.split(/\s+/);
    const command = parts[0];
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
        add('  ls         list pages');
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
          entry.type !== 'hidden' ? (
            <div key={i} class={`terminal-line terminal-${entry.type}`}>
              {entry.text}
            </div>
          ) : null
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