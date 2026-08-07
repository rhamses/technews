import { env } from "cloudflare:workers";

export const SESSION_COOKIE = "technews_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const CHALLENGE_TTL_MS = 1000 * 60 * 5;

export type AuthUser = {
  id: string;
};

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function getRequestOrigin(request: Request) {
  const url = new URL(request.url);
  return {
    origin: url.origin,
    rpID: url.hostname === "127.0.0.1" ? "localhost" : url.hostname,
  };
}

export function parseCookie(request: Request, name: string): string | null {
  const raw = request.headers.get("cookie");
  if (!raw) {
    return null;
  }

  for (const part of raw.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
}

export function sessionCookieHeader(
  sessionId: string,
  maxAgeSeconds: number,
  secure = true,
) {
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds};${secure ? " Secure;" : ""}`;
}

export function clearSessionCookieHeader(secure = true) {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${secure ? " Secure;" : ""}`;
}

export function isSecureRequest(request: Request) {
  return new URL(request.url).protocol === "https:";
}

export async function createChallenge(
  purpose: "register" | "login",
  challenge: string,
  userId?: string,
) {
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();
  await env.DB.prepare(
    `INSERT INTO auth_challenges (id, challenge, purpose, expires_at, user_id) VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(id, challenge, purpose, expiresAt, userId ?? null)
    .run();
  return id;
}

export async function consumeChallenge(id: string, purpose: "register" | "login") {
  const row = await env.DB.prepare(
    `SELECT challenge, expires_at, user_id FROM auth_challenges WHERE id = ? AND purpose = ?`,
  )
    .bind(id, purpose)
    .first<{ challenge: string; expires_at: string; user_id: string | null }>();

  await env.DB.prepare(`DELETE FROM auth_challenges WHERE id = ?`).bind(id).run();

  if (!row) {
    return null;
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }

  return {
    challenge: row.challenge,
    userId: row.user_id,
  };
}

export async function createSession(userId: string) {
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  await env.DB.prepare(
    `INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`,
  )
    .bind(id, userId, expiresAt.toISOString(), now.toISOString())
    .run();
  return { id, expiresAt };
}

export async function getSessionUser(request: Request): Promise<AuthUser | null> {
  const sessionId = parseCookie(request, SESSION_COOKIE);
  if (!sessionId) {
    return null;
  }

  const row = await env.DB.prepare(
    `SELECT user_id, expires_at FROM sessions WHERE id = ?`,
  )
    .bind(sessionId)
    .first<{ user_id: string; expires_at: string }>();

  if (!row) {
    return null;
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sessionId).run();
    return null;
  }

  return { id: row.user_id };
}

export async function destroySession(request: Request) {
  const sessionId = parseCookie(request, SESSION_COOKIE);
  if (!sessionId) {
    return;
  }
  await env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(sessionId).run();
}

export async function listReadArticleIds(userId: string): Promise<string[]> {
  const result = await env.DB.prepare(
    `SELECT article_id FROM read_articles WHERE user_id = ? ORDER BY read_at DESC`,
  )
    .bind(userId)
    .all<{ article_id: string }>();

  return (result.results ?? []).map((row) => row.article_id);
}

export async function upsertReadArticles(userId: string, articleIds: string[]) {
  const unique = [...new Set(articleIds.filter(Boolean))];
  if (unique.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  const statements = unique.map((articleId) =>
    env.DB.prepare(
      `INSERT INTO read_articles (user_id, article_id, read_at)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, article_id) DO UPDATE SET read_at = excluded.read_at`,
    ).bind(userId, articleId, now),
  );

  await env.DB.batch(statements);
}

export async function setReadArticle(userId: string, articleId: string, read: boolean) {
  if (!articleId) {
    return;
  }

  if (read) {
    await env.DB.prepare(
      `INSERT INTO read_articles (user_id, article_id, read_at)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, article_id) DO UPDATE SET read_at = excluded.read_at`,
    )
      .bind(userId, articleId, new Date().toISOString())
      .run();
    return;
  }

  await env.DB.prepare(
    `DELETE FROM read_articles WHERE user_id = ? AND article_id = ?`,
  )
    .bind(userId, articleId)
    .run();
}
