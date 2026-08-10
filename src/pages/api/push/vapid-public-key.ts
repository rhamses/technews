export const prerender = false;

import type { APIRoute } from "astro";
import { json } from "../../../lib/auth";
import { getVapidPublicKey } from "../../../lib/push";

export const GET: APIRoute = async () => {
  try {
    return json({ publicKey: getVapidPublicKey() });
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error ? error.message : "VAPID public key unavailable",
      },
      500,
    );
  }
};
