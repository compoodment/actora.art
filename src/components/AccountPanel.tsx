import { useEffect, useState } from 'preact/hooks';
import { AUTH_CHANGE_EVENT, emitAuthChange, fetchAuthSession, type AuthSession } from '../lib/auth';
import { postAuthLogout } from '../lib/api';

const GUEST_SESSION: AuthSession = {
  signedIn: false,
  username: null,
  displayName: null,
};

export default function AccountPanel() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

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
        <button type="button" class="account-button" onClick={() => window.alert('coming soon')}>
          add another passkey
        </button>
        <button type="button" class="account-button account-button-danger" onClick={logout} disabled={loggingOut}>
          {loggingOut ? 'logging out...' : 'log out'}
        </button>
      </div>
    </section>
  );
}
