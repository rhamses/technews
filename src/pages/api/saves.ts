export const prerender = false;

import type { APIRoute } from "astro";
import {
  getSessionUser,
  json,
  listSavedArticleIds,
  setSavedArticle,
  upsertSavedArticles,
} from "../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const ids = await listSavedArticleIds(user.id);
  return json({ ids });
};

export const PUT: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = (await request.json()) as { ids?: string[] };
  if (!Array.isArray(body.ids)) {
    return json({ error: "ids must be an array" }, 400);
  }

  await upsertSavedArticles(user.id, body.ids);
  const ids = await listSavedArticleIds(user.id);
  return json({ ids });
};

export const PATCH: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = (await request.json()) as { id?: string; saved?: boolean };
  if (!body.id || typeof body.saved !== "boolean") {
    return json({ error: "id and saved are required" }, 400);
  }

  await setSavedArticle(user.id, body.id, body.saved);
  return json({ ok: true });
};
