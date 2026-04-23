import { useEffect, useState } from 'preact/hooks';
import { AUTH_CHANGE_EVENT, fetchAuthSession, type AuthSession } from '../lib/auth';

const GUEST_SESSION: AuthSession = {
  signedIn: false,
  username: null,
  displayName: null,
};

export default function FooterBar() {
  const [session, setSession] = useState<AuthSession>(GUEST_SESSION);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    void fetchAuthSession().then(setSession);

    const handlePopState = () => {
      setCanGoBack(window.history.length > 1);
    };
    const handleAuthChange = (event: Event) => {
      const nextSession = (event as CustomEvent<AuthSession>).detail;
      if (nextSession) {
        setSession(nextSession);
        return;
      }
      void fetchAuthSession().then(setSession);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    };
  }, []);

  return (
    <footer class="site-footer" aria-label="Site footer">
      <div class="site-footer-group">
        <button
          type="button"
          class="site-footer-link"
          onClick={() => window.history.back()}
          disabled={!canGoBack}
          aria-hidden={!canGoBack}
        >
          back
        </button>
        <a class="site-footer-link" href="/">terminal</a>
      </div>
      <div class="site-footer-group">
        {session.signedIn && session.username ? (
          <a class="site-footer-link" href="/account">@{session.username}</a>
        ) : (
          <span class="site-footer-status">@guest</span>
        )}
      </div>
    </footer>
  );
}
