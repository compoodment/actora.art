export interface CredentialPayload {
  id: string;
  type: PublicKeyCredentialType;
  rawId: string;
  authenticatorAttachment: AuthenticatorAttachment | null;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  response: Record<string, string | string[] | null>;
}

type MaybeBufferSource = string | number[] | ArrayBuffer | Uint8Array | null | undefined;

interface StartResponseShape {
  publicKey?: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
  options?: {
    publicKey?: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
  } | PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(`${normalized}${padding}`);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function arrayBufferToBase64Url(value: ArrayBuffer): string {
  const bytes = new Uint8Array(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function toArrayBuffer(value: MaybeBufferSource): ArrayBuffer {
  if (value instanceof ArrayBuffer) return value;
  if (value instanceof Uint8Array) return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  if (Array.isArray(value)) return Uint8Array.from(value).buffer;
  if (typeof value === 'string') return base64UrlToBytes(value).buffer;
  return new ArrayBuffer(0);
}

function withPublicKey<T>(payload: unknown): T {
  const response = (payload && typeof payload === 'object' ? payload : {}) as StartResponseShape;
  const options = response.publicKey
    ?? (response.options && 'publicKey' in response.options ? response.options.publicKey : response.options);

  if (!options || typeof options !== 'object') {
    throw new Error('Auth options were missing from the server response.');
  }

  return options as T;
}

export function normalizeCreationOptions(payload: unknown): CredentialCreationOptions {
  const publicKey = withPublicKey<PublicKeyCredentialCreationOptionsJSON>(payload);

  return {
    publicKey: {
      ...publicKey,
      challenge: toArrayBuffer(publicKey.challenge),
      user: {
        ...publicKey.user,
        id: toArrayBuffer(publicKey.user.id),
      },
      excludeCredentials: publicKey.excludeCredentials?.map((credential) => ({
        ...credential,
        id: toArrayBuffer(credential.id),
      })),
    },
  };
}

export function normalizeRequestOptions(payload: unknown): CredentialRequestOptions {
  const publicKey = withPublicKey<PublicKeyCredentialRequestOptionsJSON>(payload);

  return {
    publicKey: {
      ...publicKey,
      challenge: toArrayBuffer(publicKey.challenge),
      allowCredentials: publicKey.allowCredentials?.map((credential) => ({
        ...credential,
        id: toArrayBuffer(credential.id),
      })),
    },
  };
}

export function serializeCredential(
  credential: PublicKeyCredential,
): CredentialPayload {
  const response = credential.response;
  const payload: CredentialPayload = {
    id: credential.id,
    type: credential.type,
    rawId: arrayBufferToBase64Url(credential.rawId),
    authenticatorAttachment: credential.authenticatorAttachment ?? null,
    clientExtensionResults: credential.getClientExtensionResults(),
    response: {},
  };

  if (response instanceof AuthenticatorAttestationResponse) {
    payload.response = {
      clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      attestationObject: arrayBufferToBase64Url(response.attestationObject),
      transports: typeof response.getTransports === 'function' ? response.getTransports() : [],
    };
    return payload;
  }

  if (response instanceof AuthenticatorAssertionResponse) {
    payload.response = {
      clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
      authenticatorData: arrayBufferToBase64Url(response.authenticatorData),
      signature: arrayBufferToBase64Url(response.signature),
      userHandle: response.userHandle ? arrayBufferToBase64Url(response.userHandle) : null,
    };
    return payload;
  }

  throw new Error('Unsupported credential response type.');
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}
