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
  const [isHomepage, setIsHomepage] = useState(false);

  useEffect(() => {
    const syncFooterState = () => {
      setCanGoBack(window.history.length > 1);
      setIsHomepage(window.location.pathname === '/');
    };

    syncFooterState();
    void fetchAuthSession().then(setSession);

    const handlePopState = () => {
      syncFooterState();
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
        {!isHomepage ? (
          <button
            type="button"
            class="site-footer-link"
            onClick={() => window.history.back()}
            disabled={!canGoBack}
            aria-hidden={!canGoBack}
          >
            back
          </button>
        ) : null}
        {!isHomepage ? <a class="site-footer-link" href="/">terminal</a> : null}
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
