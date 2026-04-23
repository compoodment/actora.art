import { fetchAuthMe, type AuthMeResponse, type AuthSuccessResponse, type PublicUser } from './api';

export interface AuthSession {
  signedIn: boolean;
  username: string | null;
  displayName: string | null;
}

export const AUTH_CHANGE_EVENT = 'actora-auth-changed';

function toGuestSession(): AuthSession {
  return { signedIn: false, username: null, displayName: null };
}

function isPublicUser(value: unknown): value is PublicUser {
  if (!value || typeof value !== 'object') return false;
  const user = value as PublicUser;
  return (
    typeof user.id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.displayName === 'string'
  );
}

export function authSessionFromResponse(value: unknown): AuthSession {
  if (!value || typeof value !== 'object') return toGuestSession();

  const payload = value as Partial<AuthMeResponse>;
  if (payload.signedIn !== true || !isPublicUser(payload.user)) {
    return toGuestSession();
  }

  return {
    signedIn: true,
    username: payload.user.username,
    displayName: payload.user.displayName,
  };
}

export function authSessionFromAuthSuccess(value: unknown): AuthSession {
  if (!value || typeof value !== 'object') {
    throw new Error('Authentication succeeded but the server returned an unexpected response.');
  }

  const payload = value as Partial<AuthSuccessResponse>;
  if (payload.ok !== true || !isPublicUser(payload.user)) {
    throw new Error('Authentication succeeded but the server returned an unexpected response.');
  }

  return {
    signedIn: true,
    username: payload.user.username,
    displayName: payload.user.displayName,
  };
}

export async function fetchAuthSession(): Promise<AuthSession> {
  try {
    const { response, data } = await fetchAuthMe();

    if (!response.ok) {
      return toGuestSession();
    }

    return authSessionFromResponse(data);
  } catch {
    return toGuestSession();
  }
}

export function emitAuthChange(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<AuthSession>(AUTH_CHANGE_EVENT, { detail: session }));
}
