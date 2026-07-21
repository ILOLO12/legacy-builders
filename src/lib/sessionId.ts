const SESSION_KEY = "mufo_session_id";

/** Anonymous per-tab session id, used for analytics dedup and chat rate limiting. */
export function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
