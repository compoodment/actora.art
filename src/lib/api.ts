import type { CredentialPayload } from './webauthn';

export interface ApiErrorResponse {
  error?: string;
  message?: string;
  detail?: string;
  remaining?: number;
  refundsLeft?: number;
  maxDaily?: number;
  max?: number;
  sessionCount?: number;
  resetAt?: number;
  nextResetAt?: number;
}

export interface JsonApiResponse<T> {
  response: Response;
  data: T | ApiErrorResponse | null;
}

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
}

export interface AuthMeResponse {
  signedIn: boolean;
  user: PublicUser | null;
}

export interface AuthSuccessResponse {
  ok: true;
  user: PublicUser;
}

export interface AuthLogoutResponse {
  ok: true;
  signedIn: false;
}

export interface PasskeySummary {
  id: string;
  displayId: string;
  nickname: string;
  createdAt: number | null;
  lastUsedAt: number | null;
  transports: string[];
  deviceType: string | null;
  backedUp: boolean | null;
}

export interface PasskeysResponse {
  passkeys: PasskeySummary[];
}

export interface PasskeyRenameResponse {
  ok: true;
  passkey: PasskeySummary;
}

export interface PasskeyRemoveResponse {
  ok: true;
  passkeys: PasskeySummary[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatModelChoice = 'fast' | 'smart';

export interface ChatSessionSummary {
  id: string;
  title: string;
  status: 'active' | 'archived';
  messageCount: number;
  createdAt: number | null;
  updatedAt: number | null;
  archivedAt: number | null;
  model?: string;
}

export interface ChatSessionLists {
  active: ChatSessionSummary[];
  archived: ChatSessionSummary[];
}

export interface ChatBootstrapResponse {
  messages: ChatMessage[];
  signedIn: boolean;
  sessions?: ChatSessionLists | null;
  currentSessionId?: string | null;
  model?: string;
}

export interface ChatReplyResponse {
  reply: string;
  signedIn: boolean;
  sessionId?: string;
  session?: ChatSessionSummary | null;
  sessions?: ChatSessionLists | null;
  currentSessionId?: string | null;
  remaining: number;
  resetAt: number;
  model?: string;
}

export interface ChatResetResponse {
  ok: true;
  deleted: boolean;
  messages: ChatMessage[];
  signedIn: boolean;
  sessions?: ChatSessionLists | null;
  currentSessionId?: string | null;
}

export interface ChatSessionActionResponse {
  ok: true;
  messages?: ChatMessage[];
  session?: ChatSessionSummary;
  sessions?: ChatSessionLists;
  currentSessionId?: string | null;
  model?: string;
}

export interface WallCell {
  char: string;
  color: string;
  placedAt: number;
  isMine: boolean;
}

export interface WallStateResponse {
  grid: (WallCell | null)[][];
  cols: number;
  rows: number;
  filled: number;
  total: number;
}

export interface WallBudgetResponse {
  remaining: number;
  refundsLeft: number;
  maxDaily: number;
  nextResetAt: number;
  canUndo: boolean;
  canRedo: boolean;
}

export interface WallToolPreference {
  char: string;
  color: string;
  mode: 'paint' | 'erase';
  savedColors?: (string | null)[];
}

export interface WallToolPreferenceResponse {
  signedIn: boolean;
  preference: WallToolPreference | null;
}

export interface WallPaintResponse extends WallBudgetResponse {
  placed: number;
}

export interface WallEraseResponse extends WallBudgetResponse {
  erased: number;
  refunded: number;
}

export interface WallHistoryResponse extends WallBudgetResponse {
  changed: number;
}

export interface PasskeyRegisterStartRequest {
  username?: string;
  displayName?: string;
}

export interface PasskeyStartResponse<T> {
  options: T;
}

interface WallPaintCellInput {
  x: number;
  y: number;
  char: string;
  color?: string;
}

interface WallEraseCellInput {
  x: number;
  y: number;
}

async function readJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<JsonApiResponse<T>> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...init,
  });

  return {
    response,
    data: await readJsonResponse(response) as T | ApiErrorResponse | null,
  };
}

async function postJson<T>(path: string, body?: unknown): Promise<JsonApiResponse<T>> {
  return requestJson<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function getApiErrorMessage(value: unknown, fallback: string): string {
  const data = (value && typeof value === 'object' ? value : {}) as ApiErrorResponse;
  if (data.error === 'registration_unavailable' || data.error === 'username_taken') {
    return 'Registration could not be completed.';
  }
  if (data.message && data.detail && data.message !== data.detail) return `${data.message}\n${data.detail}`;
  return data.detail || data.message || data.error || fallback;
}

export function fetchAuthMe(): Promise<JsonApiResponse<AuthMeResponse>> {
  return requestJson<AuthMeResponse>('/api/auth/me', { cache: 'no-store' });
}

export function postAuthLogout(): Promise<JsonApiResponse<AuthLogoutResponse>> {
  return postJson<AuthLogoutResponse>('/api/auth/logout');
}

export function fetchPasskeys(): Promise<JsonApiResponse<PasskeysResponse>> {
  return requestJson<PasskeysResponse>('/api/auth/passkeys', { cache: 'no-store' });
}

export function renamePasskey(id: string, nickname: string): Promise<JsonApiResponse<PasskeyRenameResponse>> {
  return postJson<PasskeyRenameResponse>('/api/auth/passkeys/rename', { id, nickname });
}

export function removePasskey(id: string): Promise<JsonApiResponse<PasskeyRemoveResponse>> {
  return postJson<PasskeyRemoveResponse>('/api/auth/passkeys/remove', { id });
}

export function startPasskeyRegister(
  body?: PasskeyRegisterStartRequest,
): Promise<JsonApiResponse<PasskeyStartResponse<PublicKeyCredentialCreationOptionsJSON>>> {
  return postJson<PasskeyStartResponse<PublicKeyCredentialCreationOptionsJSON>>('/api/auth/passkey/register/start', body);
}

export function finishPasskeyRegister(
  credential: CredentialPayload,
): Promise<JsonApiResponse<AuthSuccessResponse>> {
  return postJson<AuthSuccessResponse>('/api/auth/passkey/register/finish', credential);
}

export function startPasskeyLogin(): Promise<JsonApiResponse<PasskeyStartResponse<PublicKeyCredentialRequestOptionsJSON>>> {
  return postJson<PasskeyStartResponse<PublicKeyCredentialRequestOptionsJSON>>('/api/auth/passkey/login/start', {});
}

export function finishPasskeyLogin(
  credential: CredentialPayload,
): Promise<JsonApiResponse<AuthSuccessResponse>> {
  return postJson<AuthSuccessResponse>('/api/auth/passkey/login/finish', credential);
}

export function fetchChatBootstrap(): Promise<JsonApiResponse<ChatBootstrapResponse>> {
  return requestJson<ChatBootstrapResponse>('/api/chat');
}

export function sendChatMessage(message: string, model?: ChatModelChoice, sessionId?: string | null): Promise<JsonApiResponse<ChatReplyResponse>> {
  return postJson<ChatReplyResponse>('/api/chat', { message, model, sessionId });
}

export function resetChatThread(): Promise<JsonApiResponse<ChatResetResponse>> {
  return postJson<ChatResetResponse>('/api/chat/reset');
}

export function newChatSession(): Promise<JsonApiResponse<ChatSessionActionResponse>> {
  return postJson<ChatSessionActionResponse>('/api/chat/new');
}

export function selectChatSession(sessionId: string): Promise<JsonApiResponse<ChatSessionActionResponse>> {
  return postJson<ChatSessionActionResponse>('/api/chat/select', { sessionId });
}

export function renameChatSession(sessionId: string, title: string): Promise<JsonApiResponse<ChatSessionActionResponse>> {
  return postJson<ChatSessionActionResponse>('/api/chat/rename', { sessionId, title });
}

export function archiveChatSession(sessionId: string): Promise<JsonApiResponse<ChatSessionActionResponse>> {
  return postJson<ChatSessionActionResponse>('/api/chat/archive', { sessionId });
}

export function unarchiveChatSession(sessionId: string): Promise<JsonApiResponse<ChatSessionActionResponse>> {
  return postJson<ChatSessionActionResponse>('/api/chat/unarchive', { sessionId });
}

export function deleteChatSession(sessionId: string): Promise<JsonApiResponse<ChatSessionActionResponse>> {
  return postJson<ChatSessionActionResponse>('/api/chat/delete', { sessionId });
}

export function fetchWallState(): Promise<JsonApiResponse<WallStateResponse>> {
  return requestJson<WallStateResponse>('/api/wall');
}

export function fetchWallBudget(): Promise<JsonApiResponse<WallBudgetResponse>> {
  return requestJson<WallBudgetResponse>('/api/wall/budget');
}

export function fetchWallToolPreference(): Promise<JsonApiResponse<WallToolPreferenceResponse>> {
  return requestJson<WallToolPreferenceResponse>('/api/wall/tool-preference', { cache: 'no-store' });
}

export function saveWallToolPreference(preference: WallToolPreference): Promise<JsonApiResponse<WallToolPreferenceResponse>> {
  return postJson<WallToolPreferenceResponse>('/api/wall/tool-preference', preference);
}

export function paintWallCells(cells: WallPaintCellInput[], actionId?: string): Promise<JsonApiResponse<WallPaintResponse>> {
  return postJson<WallPaintResponse>('/api/wall/paint', { cells, actionId });
}

export function eraseWallCells(cells: WallEraseCellInput[], actionId?: string): Promise<JsonApiResponse<WallEraseResponse>> {
  return postJson<WallEraseResponse>('/api/wall/erase', { cells, actionId });
}

export function undoWallAction(): Promise<JsonApiResponse<WallHistoryResponse>> {
  return postJson<WallHistoryResponse>('/api/wall/undo');
}

export function redoWallAction(): Promise<JsonApiResponse<WallHistoryResponse>> {
  return postJson<WallHistoryResponse>('/api/wall/redo');
}
