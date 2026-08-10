export const prerender = false;

import type { APIRoute } from "astro";
import { json } from "../../../lib/auth";
import { upsertPushSubscription } from "../../../lib/push";

type SubscribeBody = {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
};

export const POST: APIRoute = async ({ request }) => {
  let body: SubscribeBody;
  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const endpoint = body.endpoint?.trim();
  const p256dh = body.keys?.p256dh?.trim();
  const auth = body.keys?.auth?.trim();

  if (!endpoint || !p256dh || !auth) {
    return json({ error: "endpoint, keys.p256dh, and keys.auth are required." }, 400);
  }

  try {
    new URL(endpoint);
  } catch {
    return json({ error: "endpoint must be a valid URL." }, 400);
  }

  await upsertPushSubscription({
    endpoint,
    p256dh,
    auth,
    userAgent: request.headers.get("user-agent"),
  });

  return json({ ok: true });
};
