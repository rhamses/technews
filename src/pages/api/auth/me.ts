export const prerender = false;

import type { APIRoute } from "astro";
import { getSessionUser, json } from "../../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
  const user = await getSessionUser(request);
  if (!user) {
    return json({ authenticated: false });
  }
  return json({ authenticated: true, userId: user.id });
};
