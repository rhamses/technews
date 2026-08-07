export const prerender = false;

import type { APIRoute } from "astro";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { env } from "cloudflare:workers";
import {
  consumeChallenge,
  createSession,
  getRequestOrigin,
  json,
  sessionCookieHeader,
  SESSION_TTL_MS,
} from "../../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as {
      challengeId?: string;
      response?: RegistrationResponseJSON;
    };

    if (!body.challengeId || !body.response) {
      return json({ error: "Missing challengeId or response" }, 400);
    }

    const challenge = await consumeChallenge(body.challengeId, "register");
    if (!challenge?.challenge || !challenge.userId) {
      return json({ error: "Challenge expired or invalid" }, 400);
    }

    const { rpID, origin } = getRequestOrigin(request);
    const verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge: challenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return json({ error: "Passkey registration failed" }, 400);
    }

    const { credential, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    const now = new Date().toISOString();
    const transports = body.response.response.transports ?? [];

    await env.DB.batch([
      env.DB.prepare(`INSERT INTO users (id, created_at) VALUES (?, ?)`).bind(
        challenge.userId,
        now,
      ),
      env.DB.prepare(
        `INSERT INTO credentials
          (id, user_id, public_key, counter, device_type, backed_up, transports, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        credential.id,
        challenge.userId,
        isoBase64URL.fromBuffer(credential.publicKey),
        credential.counter,
        credentialDeviceType,
        credentialBackedUp ? 1 : 0,
        JSON.stringify(transports),
        now,
      ),
    ]);

    const session = await createSession(challenge.userId);
    const secure = new URL(request.url).protocol === "https:";

    return json(
      { ok: true, userId: challenge.userId },
      200,
      {
        "Set-Cookie": sessionCookieHeader(
          session.id,
          Math.floor(SESSION_TTL_MS / 1000),
          secure,
        ),
      },
    );
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Registration verification failed",
      },
      500,
    );
  }
};
