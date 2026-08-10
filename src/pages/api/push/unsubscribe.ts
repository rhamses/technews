export const prerender = false;

import type { APIRoute } from "astro";
import { json } from "../../../lib/auth";
import { deletePushSubscription } from "../../../lib/push";

type UnsubscribeBody = {
  endpoint?: string;
};

export const POST: APIRoute = async ({ request }) => {
  let body: UnsubscribeBody;
  try {
    body = (await request.json()) as UnsubscribeBody;
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const endpoint = body.endpoint?.trim();
  if (!endpoint) {
    return json({ error: "endpoint is required." }, 400);
  }

  await deletePushSubscription(endpoint);
  return json({ ok: true });
};
