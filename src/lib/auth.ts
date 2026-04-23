export interface AuthSession {
  signedIn: boolean;
  username: string | null;
  displayName: string | null;
}

interface AuthMeResponse {
  signedIn?: boolean;
  authenticated?: boolean;
  user?: {
    username?: string | null;
    name?: string | null;
    displayName?: string | null;
  } | null;
  username?: string | null;
  name?: string | null;
  displayName?: string | null;
}

export const AUTH_CHANGE_EVENT = 'actora-auth-changed';

export function normalizeAuthSession(value: unknown): AuthSession {
  const payload = (value && typeof value === 'object' ? value : {}) as AuthMeResponse;
  const user = payload.user && typeof payload.user === 'object' ? payload.user : null;
  const username = user?.username ?? payload.username ?? null;
  const displayName = user?.displayName ?? user?.name ?? payload.displayName ?? payload.name ?? null;
  const signedIn = Boolean(payload.signedIn ?? payload.authenticated ?? username);

  return {
    signedIn,
    username: typeof username === 'string' && username.trim() ? username : null,
    displayName: typeof displayName === 'string' && displayName.trim() ? displayName : null,
  };
}

export async function fetchAuthSession(): Promise<AuthSession> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'same-origin',
      cache: 'no-store',
    });

    if (!response.ok) {
      return { signedIn: false, username: null, displayName: null };
    }

    const payload = await response.json() as unknown;
    return normalizeAuthSession(payload);
  } catch {
    return { signedIn: false, username: null, displayName: null };
  }
}

export function emitAuthChange(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AuthSession>(AUTH_CHANGE_EVENT, { detail: session }));
}
