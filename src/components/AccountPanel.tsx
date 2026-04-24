import { useEffect, useState } from 'preact/hooks';
import {
  AUTH_CHANGE_EVENT,
  authSessionFromAuthSuccess,
  emitAuthChange,
  fetchAuthSession,
  type AuthSession,
} from '../lib/auth';
import {
  finishPasskeyRegister,
  getApiErrorMessage,
  postAuthLogout,
  startPasskeyRegister,
} from '../lib/api';
import {
  cleanPasskeyError,
  isPublicKeyCredential,
  normalizeCreationOptions,
  requireWebAuthnSupport,
  serializeCredential,
} from '../lib/webauthn';

const GUEST_SESSION: AuthSession = {
  signedIn: false,
  username: null,
  displayName: null,
};

export default function AccountPanel() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [addingPasskey, setAddingPasskey] = useState(false);
  const [passkeyStatus, setPasskeyStatus] = useState('ready to add another passkey.');

  useEffect(() => {
    let active = true;

    void fetchAuthSession().then((nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (!nextSession.signedIn) {
        window.location.replace('/');
      }
    });

    const handleAuthChange = (event: Event) => {
      const nextSession = (event as CustomEvent<AuthSession>).detail ?? GUEST_SESSION;
      setSession(nextSession);
      if (!nextSession.signedIn) {
        window.location.replace('/');
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    };
  }, []);

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      await postAuthLogout();
    } finally {
      emitAuthChange(GUEST_SESSION);
      window.location.assign('/');
    }
  };

  const addPasskey = async () => {
    if (addingPasskey || loggingOut) return;
    setAddingPasskey(true);
    setPasskeyStatus('waiting for security key / biometric approval...');

    try {
      requireWebAuthnSupport();

      const { response, data } = await startPasskeyRegister();
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, 'Unable to start passkey setup.'));
      }

      const credential = await navigator.credentials.create(normalizeCreationOptions(data));
      if (!isPublicKeyCredential(credential)) {
        throw new Error('Passkey setup was cancelled.');
      }

      const finish = await finishPasskeyRegister(serializeCredential(credential));
      if (!finish.response.ok) {
        throw new Error(getApiErrorMessage(finish.data, 'Unable to finish passkey setup.'));
      }

      const nextSession = authSessionFromAuthSuccess(finish.data);
      setSession(nextSession);
      emitAuthChange(nextSession);
      setPasskeyStatus('passkey added.');
    } catch (error) {
      setPasskeyStatus(cleanPasskeyError(
        error,
        'passkey setup cancelled.',
        'passkey setup failed.',
        { includeExplicitCancellation: true },
      ));
    } finally {
      setAddingPasskey(false);
    }
  };

  if (session === null) {
    return (
      <section class="account-card" aria-busy="true">
        <p class="account-meta">checking session...</p>
      </section>
    );
  }

  if (!session.signedIn) {
    return (
      <section class="account-card">
        <p class="account-meta">access denied. redirecting to terminal...</p>
      </section>
    );
  }

  return (
    <section class="account-card">
      <header class="account-header">
        <p class="account-kicker">account</p>
        <h1 class="account-title">@{session.username ?? 'account'}</h1>
        <p class="account-meta">signed in with passkey authentication.</p>
      </header>

      <dl class="account-details">
        <div class="account-detail-row">
          <dt>username</dt>
          <dd>{session.username ?? 'unknown'}</dd>
        </div>
        <div class="account-detail-row">
          <dt>display name</dt>
          <dd>{session.displayName ?? 'not set'}</dd>
        </div>
      </dl>

      <div class="account-actions">
        <button type="button" class="account-button" onClick={addPasskey} disabled={addingPasskey || loggingOut}>
          {addingPasskey ? 'adding passkey...' : 'add another passkey'}
        </button>
        <button type="button" class="account-button account-button-danger" onClick={logout} disabled={loggingOut || addingPasskey}>
          {loggingOut ? 'logging out...' : 'log out'}
        </button>
      </div>

      <p class="account-meta" aria-live="polite">{passkeyStatus}</p>
    </section>
  );
}
