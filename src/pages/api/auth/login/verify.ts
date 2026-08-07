export const prerender = false;

import type { APIRoute } from "astro";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/server";
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

type CredentialRow = {
  id: string;
  user_id: string;
  public_key: string;
  counter: number;
  transports: string | null;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as {
      challengeId?: string;
      response?: AuthenticationResponseJSON;
    };

    if (!body.challengeId || !body.response) {
      return json({ error: "Missing challengeId or response" }, 400);
    }

    const challenge = await consumeChallenge(body.challengeId, "login");
    if (!challenge?.challenge) {
      return json({ error: "Challenge expired or invalid" }, 400);
    }

    const credential = await env.DB.prepare(
      `SELECT id, user_id, public_key, counter, transports FROM credentials WHERE id = ?`,
    )
      .bind(body.response.id)
      .first<CredentialRow>();

    if (!credential) {
      return json({ error: "Unknown passkey" }, 404);
    }

    const { rpID, origin } = getRequestOrigin(request);
    const transports = credential.transports
      ? (JSON.parse(credential.transports) as AuthenticatorTransportFuture[])
      : undefined;

    const verification = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge: challenge.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: credential.id,
        publicKey: isoBase64URL.toBuffer(credential.public_key),
        counter: credential.counter,
        transports,
      },
      requireUserVerification: false,
    });

    if (!verification.verified) {
      return json({ error: "Passkey login failed" }, 400);
    }

    await env.DB.prepare(`UPDATE credentials SET counter = ? WHERE id = ?`)
      .bind(verification.authenticationInfo.newCounter, credential.id)
      .run();

    const session = await createSession(credential.user_id);
    const secure = new URL(request.url).protocol === "https:";

    return json(
      { ok: true, userId: credential.user_id },
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
        error: error instanceof Error ? error.message : "Login verification failed",
      },
      500,
    );
  }
};

type AuthenticatorTransportFuture =
  | "ble"
  | "cable"
  | "hybrid"
  | "internal"
  | "nfc"
  | "smart-card"
  | "usb";
