export const prerender = false;

import type { APIRoute } from "astro";
import { getSessionUser, json } from "../../lib/auth";
import type { ReadLaterCard } from "../../lib/extract-article";
import {
  deleteReadLaterArticle,
  ingestReadLaterUrl,
  listReadLaterArticles,
  upsertReadLaterItems,
} from "../../lib/read-later";

export const GET: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const items = await listReadLaterArticles(user.id);
  return json({ items });
};

export const POST: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  const body = (await request.json().catch(() => null)) as {
    url?: string;
  } | null;

  if (!body?.url || typeof body.url !== "string") {
    return json({ error: "url is required" }, 400);
  }

  try {
    const item = await ingestReadLaterUrl(body.url, user?.id ?? null);
    return json({ item });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to process URL";
    const status = /invalid url|http\(s\)/i.test(message) ? 400 : 422;
    return json({ error: message }, status);
  }
};

export const PUT: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = (await request.json().catch(() => null)) as {
    items?: ReadLaterCard[];
  } | null;

  if (!Array.isArray(body?.items)) {
    return json({ error: "items must be an array" }, 400);
  }

  await upsertReadLaterItems(user.id, body.items);
  const items = await listReadLaterArticles(user.id);
  return json({ items });
};

export const DELETE: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = (await request.json().catch(() => null)) as {
    id?: string;
  } | null;

  if (!body?.id || typeof body.id !== "string") {
    return json({ error: "id is required" }, 400);
  }

  await deleteReadLaterArticle(user.id, body.id);
  return json({ ok: true });
};
