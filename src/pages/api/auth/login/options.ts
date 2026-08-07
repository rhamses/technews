export const prerender = false;

import type { APIRoute } from "astro";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { createChallenge, getRequestOrigin, json } from "../../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { rpID } = getRequestOrigin(request);

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: "preferred",
    });

    const challengeId = await createChallenge("login", options.challenge);

    return json({
      options,
      challengeId,
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to start login",
      },
      500,
    );
  }
};
