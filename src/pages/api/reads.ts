export const prerender = false;

import type { APIRoute } from "astro";
import {
  getSessionUser,
  json,
  listReadArticleIds,
  setReadArticle,
  upsertReadArticles,
} from "../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const ids = await listReadArticleIds(user.id);
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

  await upsertReadArticles(user.id, body.ids);
  const ids = await listReadArticleIds(user.id);
  return json({ ids });
};

export const PATCH: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = (await request.json()) as { id?: string; read?: boolean };
  if (!body.id || typeof body.read !== "boolean") {
    return json({ error: "id and read are required" }, 400);
  }

  await setReadArticle(user.id, body.id, body.read);
  return json({ ok: true });
};
