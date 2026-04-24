/**
 * Terminal auth flows.
 *
 * Extracted from TerminalHero to keep passkey initiation, error cleaning,
 * and auth API calls separated from the pure terminal UI rendering.
 */

import {
  authSessionFromAuthSuccess,
  emitAuthChange,
  fetchAuthSession,
  type AuthSession,
} from './auth';
import {
  finishPasskeyLogin,
  finishPasskeyRegister,
  getApiErrorMessage,
  postAuthLogout,
  startPasskeyLogin,
  startPasskeyRegister,
  type AuthSuccessResponse,
  type JsonApiResponse,
} from './api';
import {
  cleanPasskeyError,
  type CredentialPayload,
  getErrorMessage,
  isPublicKeyCredential,
  normalizeCreationOptions,
  normalizeRequestOptions,
  requireWebAuthnSupport,
  serializeCredential,
} from './webauthn';
import type { Entry } from './terminal-commands';

export const GUEST_SESSION: AuthSession = {
  signedIn: false,
  username: null,
  displayName: null,
};

async function submitCredential(
  credential: PublicKeyCredential,
  submit: (payload: CredentialPayload) => Promise<JsonApiResponse<AuthSuccessResponse>>,
): Promise<AuthSession> {
  const { response, data } = await submit(serializeCredential(credential));
  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, 'Authentication failed.'));
  }
  return authSessionFromAuthSuccess(data);
}

export interface AuthFlowCallbacks {
  setBusy: (busy: boolean) => void;
  appendEntries: (entries: Entry[]) => void;
  setAuthSession: (session: AuthSession) => void;
}

export async function runLoginFlow(callbacks: AuthFlowCallbacks): Promise<void> {
  const { setBusy, appendEntries, setAuthSession } = callbacks;

  try {
    const currentSession = await fetchAuthSession();
    setAuthSession(currentSession);
    emitAuthChange(currentSession);

    if (currentSession.signedIn) {
      appendEntries([{ type: 'output', text: 'already signed in silly.' }]);
      return;
    }

    setBusy(true);
    appendEntries([{ type: 'system', text: '> waiting for security key / biometric approval...' }]);

    requireWebAuthnSupport();

    const { response, data } = await startPasskeyLogin();
    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, 'Unable to start passkey login.'));
    }

    const credential = await navigator.credentials.get(normalizeRequestOptions(data));
    if (!isPublicKeyCredential(credential)) {
      throw new Error('Passkey login was cancelled.');
    }

    const nextSession = await submitCredential(credential, finishPasskeyLogin);

    setAuthSession(nextSession);
    emitAuthChange(nextSession);
    appendEntries([
      {
        type: 'system',
        text: nextSession.signedIn && nextSession.username
          ? `> logged in as @${nextSession.username}.`
          : '> login complete.',
      },
    ]);
  } catch (error) {
    appendEntries([
      {
        type: 'output',
        text: cleanPasskeyError(error, 'cancelled.', 'login failed.'),
      },
    ]);
  } finally {
    setBusy(false);
  }
}

export async function runRegisterFlow(
  username: string,
  displayName: string,
  callbacks: AuthFlowCallbacks,
): Promise<void> {
  const { setBusy, appendEntries, setAuthSession } = callbacks;

  setBusy(true);
  appendEntries([{ type: 'system', text: '> waiting for security key / biometric approval...' }]);

  try {
    requireWebAuthnSupport();

    const { response, data } = await startPasskeyRegister({ username, displayName });
    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, 'Unable to start passkey registration.'));
    }

    const credential = await navigator.credentials.create(normalizeCreationOptions(data));
    if (!isPublicKeyCredential(credential)) {
      throw new Error('Passkey registration was cancelled.');
    }

    const nextSession = await submitCredential(credential, finishPasskeyRegister);

    setAuthSession(nextSession);
    emitAuthChange(nextSession);
    appendEntries([
      {
        type: 'system',
        text: nextSession.signedIn && nextSession.username
          ? `> registered and signed in as @${nextSession.username}.`
          : '> registration complete.',
      },
    ]);
  } catch (error) {
    appendEntries([
      {
        type: 'output',
        text: cleanPasskeyError(error, 'cancelled.', 'register failed.'),
      },
    ]);
  } finally {
    setBusy(false);
  }
}

export async function runLogoutFlow(callbacks: AuthFlowCallbacks): Promise<void> {
  const { setBusy, appendEntries, setAuthSession } = callbacks;

  const currentSession = await fetchAuthSession();
  setAuthSession(currentSession);
  emitAuthChange(currentSession);

  if (!currentSession.signedIn) {
    appendEntries([{ type: 'output', text: 'already signed out silly.' }]);
    return;
  }

  setBusy(true);

  try {
    const { response, data } = await postAuthLogout();
    if (!response.ok) {
      throw new Error(getApiErrorMessage(data, 'Unable to log out.'));
    }

    setAuthSession(GUEST_SESSION);
    emitAuthChange(GUEST_SESSION);
    appendEntries([{ type: 'system', text: '> logged out.' }]);
  } catch (error) {
    const msg = getErrorMessage(error, 'try again.');
    appendEntries([{ type: 'output', text: `logout failed. ${msg.toLowerCase()}` }]);
  } finally {
    setBusy(false);
  }
}