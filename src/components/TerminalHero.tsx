import { useEffect, useRef, useState } from 'preact/hooks';

interface Command {
  input: string;
  output: string | string[];
}

export default function TerminalHero() {
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input on mount and keep it focused when clicking the terminal
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    // Scroll to bottom when history changes
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      let output: string | string[] = '';

      if (cmd === '') {
        output = '';
      } else if (cmd === 'help') {
        output = ['available commands:', '  whoami  - about', '  ls      - projects', '  clear   - clear terminal'];
      } else if (cmd === 'whoami') {
        output = 'computment. making systems and things worth keeping.';
      } else if (cmd === 'ls') {
        output = ['actora/', 'experiments/'];
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else {
        output = `command not found: ${cmd}`;
      }

      setHistory([...history, { input: cmd, output }]);
      setInput('');
    }
  };

  return (
    <div 
      className="terminal-widget" 
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-history">
        <div className="terminal-line">actoraOS v1.0.0</div>
        <div className="terminal-line">type 'help' to start</div>
        <br />
        {history.map((cmd, i) => (
          <div key={i}>
            <div className="terminal-input-line">
              <span className="prompt">❯</span> {cmd.input}
            </div>
            {Array.isArray(cmd.output) ? (
              cmd.output.map((line, j) => <div key={j} className="terminal-output">{line}</div>)
            ) : (
              <div className="terminal-output">{cmd.output}</div>
            )}
          </div>
        ))}
      </div>
      <div className="terminal-input-line current">
        <span className="prompt">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          onKeyDown={handleCommand}
          className="terminal-input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}