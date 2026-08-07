export const prerender = false;

import type { APIRoute } from "astro";
import {
  clearSessionCookieHeader,
  destroySession,
  json,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  await destroySession(request);
  const secure = new URL(request.url).protocol === "https:";
  return json(
    { ok: true },
    200,
    {
      "Set-Cookie": clearSessionCookieHeader(secure),
    },
  );
};
