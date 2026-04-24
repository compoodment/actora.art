/**
 * Terminal command definitions and processing.
 *
 * Extracted from TerminalHero so command routing, page definitions,
 * and easter eggs live in one place without UI or auth concerns.
 */

export interface Entry {
  type: 'input' | 'output' | 'system';
  text: string;
}

export const PAGES: Record<string, { description: string; url?: string }> = {
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

export const EASTER_EGGS: Record<string, string> = {
  faggot: 'no u',
  meow: 'meow :3',
  '42': 'the answer to life, the universe, and everything',
  bitch: 'no u',
};

export interface CommandResult {
  entries: Entry[];
  /** Navigate to this URL after a short delay (terminal shows the message first). */
  navigate?: string;
  /** If true, skip the normal appendEntries call — the caller already appended. */
  handled?: boolean;
}

/**
 * Process a terminal command and return entries + optional navigation.
 *
 * Auth-dependent commands (login, register, logout) are not handled here —
 * they're delegated back to the component so auth state management stays local.
 */
export function processCommand(raw: string): CommandResult | null {
  if (!raw.trim()) {
    return { entries: [{ type: 'input', text: '~ ❯ ' }] };
  }

  const parts = raw.trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  const entries: Entry[] = [{ type: 'input', text: `~ ❯ ${raw.trim()}` }];
  const add = (text: string, type: Entry['type'] = 'output') => {
    entries.push({ type, text });
  };

  const easterEggKey = raw.trim().toLowerCase();
  if (EASTER_EGGS[easterEggKey]) {
    add(EASTER_EGGS[easterEggKey]!);
    return { entries };
  }

  switch (command) {
    case 'help':
      add('commands:', 'system');
      add('  ls              list pages');
      add('  cd <page>       go to a page');
      add('  cat <page>      read about a page');
      add('  register        create an account with a passkey');
      add('  login           sign in with a passkey');
      add('  logout          sign out of your account');
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

      // Account navigation needs auth check — signal to caller
      if (target === 'account') {
        // Return a special result; the component handles the auth gate
        return { entries, navigate: '/account', handled: false };
      }

      const page = PAGES[target];
      if (page?.url) {
        add(`navigating to ${target}...`, 'system');
        return { entries, navigate: page.url };
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
        add("actora.art — projects, experiments, computment's site.");
      } else {
        add(`cat: ${target}: not found`);
      }
      break;
    }

    case 'whoareu':
      add('computment');
      break;

    case 'clear':
      // Special: return empty result with a clear signal
      return { entries: [], handled: true };

    // Auth commands are handled by the component, not here.
    // They need access to auth state and callbacks.
    case 'login':
    case 'register':
    case 'logout':
      return null; // Signal to caller: handle this yourself

    default:
      add(`command not found: ${command}`);
      break;
  }

  return { entries };
}