import { useEffect, useState } from 'preact/hooks';
import { AUTH_CHANGE_EVENT, fetchAuthSession, type AuthSession } from '../lib/auth';
import { ACTORA_OS_VERSION } from '../lib/version';

const GUEST_SESSION: AuthSession = {
  signedIn: false,
  username: null,
  displayName: null,
};

export default function FooterBar() {
  const [session, setSession] = useState<AuthSession>(GUEST_SESSION);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);
  const [isHomepage, setIsHomepage] = useState(false);

  useEffect(() => {
    const syncFooterState = () => {
      const navigationApi = (window as Window & {
        navigation?: {
          canGoBack?: boolean;
          canGoForward?: boolean;
        };
      }).navigation;

      setCanGoBack(
        typeof navigationApi?.canGoBack === 'boolean'
          ? navigationApi.canGoBack
          : window.history.length > 1,
      );
      setCanGoForward(
        typeof navigationApi?.canGoForward === 'boolean'
          ? navigationApi.canGoForward
          : true,
      );
      setIsHomepage(window.location.pathname === '/');
    };

    syncFooterState();
    void fetchAuthSession().then(setSession);

    const handlePopState = () => {
      syncFooterState();
    };
    const handlePageShow = () => {
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
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange as EventListener);
    };
  }, []);

  return (
    <footer class="site-footer" aria-label="Site footer">
      <div class="site-footer-group">
        <>
          <button
            type="button"
            class="site-footer-link"
            onClick={() => window.history.back()}
            disabled={!canGoBack}
          >
            back
          </button>
          <button
            type="button"
            class="site-footer-link"
            onClick={() => window.history.forward()}
            disabled={!canGoForward}
          >
            forward
          </button>
        </>
      </div>
      {!isHomepage ? <a class="site-footer-link site-footer-version" href="/">actoraOS v{ACTORA_OS_VERSION}</a> : null}
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
