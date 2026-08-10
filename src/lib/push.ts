import { env } from "cloudflare:workers";
import {
  buildPushPayload,
  type PushSubscription as WebPushSubscription,
} from "@block65/webcrypto-web-push";

export type PushSubscriptionRecord = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type NotifyPayload = {
  title: string;
  body: string;
  url?: string;
};

function requireSecret(name: string): string {
  const value = (env as Record<string, string | undefined>)[name];
  if (!value) {
    throw new Error(`Missing secret ${name}`);
  }
  return value;
}

export function getVapidPublicKey(): string {
  return requireSecret("VAPID_PUBLIC_KEY");
}

export async function upsertPushSubscription(input: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string | null;
}) {
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(endpoint) DO UPDATE SET
       p256dh = excluded.p256dh,
       auth = excluded.auth,
       user_agent = excluded.user_agent,
       updated_at = excluded.updated_at`,
  )
    .bind(
      input.endpoint,
      input.p256dh,
      input.auth,
      input.userAgent ?? null,
      now,
      now,
    )
    .run();
}

export async function deletePushSubscription(endpoint: string) {
  await env.DB.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`)
    .bind(endpoint)
    .run();
}

export async function listPushSubscriptions(): Promise<PushSubscriptionRecord[]> {
  const result = await env.DB.prepare(
    `SELECT endpoint, p256dh, auth FROM push_subscriptions`,
  ).all<PushSubscriptionRecord>();
  return result.results ?? [];
}

export async function sendPushToAll(payload: NotifyPayload): Promise<{
  sent: number;
  failed: number;
  removed: number;
}> {
  const subscriptions = await listPushSubscriptions();
  const vapid = {
    subject:
      (env as Record<string, string | undefined>).VAPID_SUBJECT ||
      "mailto:technews@amb1.io",
    publicKey: requireSecret("VAPID_PUBLIC_KEY"),
    privateKey: requireSecret("VAPID_PRIVATE_KEY"),
  };

  let sent = 0;
  let failed = 0;
  let removed = 0;

  const message = {
    title: payload.title,
    body: payload.body,
    url: payload.url || "/",
  };

  await Promise.all(
    subscriptions.map(async (row) => {
      const subscription: WebPushSubscription = {
        endpoint: row.endpoint,
        expirationTime: null,
        keys: {
          p256dh: row.p256dh,
          auth: row.auth,
        },
      };

      try {
        const requestInit = await buildPushPayload(
          {
            data: message,
            options: {
              ttl: 60 * 60,
              urgency: "normal",
            },
          },
          subscription,
          vapid,
        );

        const response = await fetch(subscription.endpoint, requestInit);

        if (response.status === 404 || response.status === 410) {
          await deletePushSubscription(row.endpoint);
          removed += 1;
          return;
        }

        if (!response.ok) {
          failed += 1;
          return;
        }

        sent += 1;
      } catch {
        failed += 1;
      }
    }),
  );

  return { sent, failed, removed };
}

export function buildNewArticlesPayload(added: number): NotifyPayload {
  if (added <= 0) {
    return {
      title: "Technews updated",
      body: "No new articles in this update.",
      url: "/",
    };
  }

  const noun = added === 1 ? "article" : "articles";
  return {
    title: "Technews",
    body: `${added} new ${noun} since the last update.`,
    url: "/",
  };
}
