export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { json } from "../../../lib/auth";
import { buildNewArticlesPayload, sendPushToAll } from "../../../lib/push";

type NotifyBody = {
  added?: number;
};

function authorized(request: Request): boolean {
  const expected = (env as Record<string, string | undefined>).PUSH_NOTIFY_SECRET;
  if (!expected) {
    return false;
  }
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  return token.length > 0 && token === expected;
}

export const POST: APIRoute = async ({ request }) => {
  if (!authorized(request)) {
    return json({ error: "Unauthorized" }, 401);
  }

  let body: NotifyBody = {};
  try {
    body = (await request.json()) as NotifyBody;
  } catch {
    // empty body is fine; treat as 0
  }

  const added = Number(body.added);
  const count = Number.isFinite(added) && added >= 0 ? Math.floor(added) : 0;
  const payload = buildNewArticlesPayload(count);

  try {
    const result = await sendPushToAll(payload);
    return json({
      ok: true,
      added: count,
      payload,
      ...result,
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to send push",
      },
      500,
    );
  }
};
