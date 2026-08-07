export const prerender = false;

import type { APIRoute } from "astro";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import {
  createChallenge,
  getRequestOrigin,
  json,
} from "../../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { rpID } = getRequestOrigin(request);
    const userId = crypto.randomUUID();
    const userName = `reader-${userId.slice(0, 8)}`;

    const options = await generateRegistrationOptions({
      rpName: "Technews",
      rpID,
      userName,
      userDisplayName: "Technews Reader",
      userID: new TextEncoder().encode(userId),
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "preferred",
      },
      supportedAlgorithmIDs: [-7, -257],
    });

    const challengeId = await createChallenge("register", options.challenge, userId);

    return json({
      options,
      challengeId,
      userId,
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Failed to start registration",
      },
      500,
    );
  }
};
