import { useEffect, useState } from 'preact/hooks';
import {
  AUTH_CHANGE_EVENT,
  authSessionFromAuthSuccess,
  emitAuthChange,
  fetchAuthSession,
  type AuthSession,
} from '../lib/auth';
import {
  fetchPasskeys,
  finishPasskeyRegister,
  getApiErrorMessage,
  postAuthLogout,
  renamePasskey,
  startPasskeyRegister,
  type PasskeySummary,
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

function formatDate(value: number | null): string {
  if (!value) return 'unknown';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatPasskeyKind(passkey: PasskeySummary): string {
  const transports = new Set(passkey.transports);
  if (transports.has('internal')) return 'built-in passkey';
  if (transports.has('hybrid')) return 'phone or tablet passkey';
  if (transports.has('usb') || transports.has('nfc') || transports.has('ble')) return 'security key';
  return `passkey ...${passkey.displayId}`;
}

function getPasskeyLabel(passkey: PasskeySummary): string {
  return passkey.nickname || formatPasskeyKind(passkey);
}

export default function AccountPanel() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [addingPasskey, setAddingPasskey] = useState(false);
  const [passkeyStatus, setPasskeyStatus] = useState('');
  const [passkeys, setPasskeys] = useState<PasskeySummary[]>([]);
  const [passkeysLoading, setPasskeysLoading] = useState(false);
  const [passkeysError, setPasskeysError] = useState<string | null>(null);
  const [editingPasskeyId, setEditingPasskeyId] = useState<string | null>(null);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [renamingPasskeyId, setRenamingPasskeyId] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  const loadPasskeys = async () => {
    setPasskeysLoading(true);
    setPasskeysError(null);

    try {
      const { response, data } = await fetchPasskeys();
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, 'Unable to load passkeys.'));
      }

      const nextPasskeys = data && 'passkeys' in data && Array.isArray(data.passkeys)
        ? data.passkeys
        : [];
      setPasskeys(nextPasskeys);
    } catch (error) {
      setPasskeysError(error instanceof Error ? error.message : 'Unable to load passkeys.');
    } finally {
      setPasskeysLoading(false);
    }
  };

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

  useEffect(() => {
    if (!session?.signedIn) return;
    void loadPasskeys();
  }, [session?.signedIn]);

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
    setPasskeyStatus('waiting for passkey approval...');

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
      await loadPasskeys();
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

  const startRename = (passkey: PasskeySummary) => {
    setEditingPasskeyId(passkey.id);
    setNicknameDraft(passkey.nickname);
    setRenameError(null);
  };

  const cancelRename = () => {
    setEditingPasskeyId(null);
    setNicknameDraft('');
    setRenameError(null);
  };

  const saveRename = async (passkey: PasskeySummary) => {
    if (renamingPasskeyId) return;
    setRenamingPasskeyId(passkey.id);
    setRenameError(null);

    try {
      const { response, data } = await renamePasskey(passkey.id, nicknameDraft);
      if (!response.ok) {
        throw new Error(getApiErrorMessage(data, 'Unable to rename passkey.'));
      }

      const updated = data && 'passkey' in data ? data.passkey : null;
      if (updated) {
        setPasskeys((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        await loadPasskeys();
      }
      setEditingPasskeyId(null);
      setNicknameDraft('');
    } catch (error) {
      setRenameError(error instanceof Error ? error.message : 'Unable to rename passkey.');
    } finally {
      setRenamingPasskeyId(null);
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

      <section class="account-passkeys" aria-busy={passkeysLoading}>
        <div class="account-section-heading">
          <h2>linked passkeys</h2>
          <p>{passkeys.length} total</p>
        </div>

        {passkeysLoading && passkeys.length === 0 ? (
          <p class="account-meta">loading passkeys...</p>
        ) : passkeysError ? (
          <p class="account-meta account-error">{passkeysError}</p>
        ) : passkeys.length === 0 ? (
          <p class="account-meta">no passkeys linked yet.</p>
        ) : (
          <ul class="account-passkey-list">
            {passkeys.map((passkey) => (
              <li class="account-passkey" key={passkey.id}>
                <div class="account-passkey-head">
                  <div class="account-passkey-title">
                    {editingPasskeyId === passkey.id ? (
                      <input
                        type="text"
                        value={nicknameDraft}
                        maxLength={40}
                        placeholder={formatPasskeyKind(passkey)}
                        onInput={(event) => setNicknameDraft(event.currentTarget.value)}
                        disabled={renamingPasskeyId === passkey.id}
                        aria-label="passkey nickname"
                      />
                    ) : (
                      <span>{getPasskeyLabel(passkey)}</span>
                    )}
                    <small>...{passkey.displayId}</small>
                  </div>
                  {passkey.nickname ? <span>{formatPasskeyKind(passkey)}</span> : null}
                </div>
                <div class="account-passkey-actions">
                  {editingPasskeyId === passkey.id ? (
                    <>
                      <button type="button" onClick={() => void saveRename(passkey)} disabled={renamingPasskeyId === passkey.id}>
                        {renamingPasskeyId === passkey.id ? 'saving...' : 'save'}
                      </button>
                      <button type="button" onClick={cancelRename} disabled={renamingPasskeyId === passkey.id}>
                        cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => startRename(passkey)}>
                      rename
                    </button>
                  )}
                </div>
                <dl class="account-passkey-details">
                  <div>
                    <dt>added</dt>
                    <dd>{formatDate(passkey.createdAt)}</dd>
                  </div>
                  <div>
                    <dt>last used</dt>
                    <dd>{formatDate(passkey.lastUsedAt)}</dd>
                  </div>
                </dl>
                {renameError && editingPasskeyId === passkey.id ? (
                  <p class="account-meta account-error">{renameError}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div class="account-actions">
        <button type="button" class="account-button" onClick={addPasskey} disabled={addingPasskey || loggingOut}>
          {addingPasskey ? 'adding passkey...' : 'add another passkey'}
        </button>
        <button type="button" class="account-button account-button-danger" onClick={logout} disabled={loggingOut || addingPasskey}>
          {loggingOut ? 'logging out...' : 'log out'}
        </button>
      </div>

      {passkeyStatus ? <p class="account-meta" aria-live="polite">{passkeyStatus}</p> : null}
    </section>
  );
}
