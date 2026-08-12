import { createHash } from "node:crypto";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const ROOT = process.cwd();
const ARTICLES_DIR = join(ROOT, "src", "content", "articles");
const CHECKPOINTS_PATH = join(ROOT, "data", "checkpoints.json");
const BUCKET = process.env.R2_BUCKET || "technews-content";
const ACCOUNT_ID =
  process.env.CLOUDFLARE_ACCOUNT_ID || "182788b23836a15ba32a69d616ba1db1";
const CONCURRENCY = Number(process.env.R2_SYNC_CONCURRENCY || 24);

type RemoteObject = {
  key: string;
  size?: number;
  etag?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

function getCloudflareApiToken(): string | null {
  return (
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.CF_API_TOKEN ||
    process.env.WRANGLER_API_TOKEN ||
    null
  );
}

function canUseS3(): boolean {
  return Boolean(
    process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY,
  );
}

function createClient(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

async function cfApi<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<{ status: number; json?: T; bytes?: Uint8Array; headers: Headers }> {
  const token = getCloudflareApiToken();
  if (!token) {
    throw new Error(
      "Missing CLOUDFLARE_API_TOKEN (or R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY)",
    );
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return {
      status: response.status,
      json: (await response.json()) as T,
      headers: response.headers,
    };
  }

  return {
    status: response.status,
    bytes: new Uint8Array(await response.arrayBuffer()),
    headers: response.headers,
  };
}

async function listRemoteViaApi(prefix: string): Promise<Map<string, RemoteObject>> {
  const objects = new Map<string, RemoteObject>();
  let cursor: string | undefined;

  do {
    const query = new URLSearchParams({
      per_page: "1000",
      prefix,
    });
    if (cursor) {
      query.set("cursor", cursor);
    }

    const { status, json } = await cfApi<{
      success: boolean;
      result?: Array<{ key: string; size?: number; etag?: string }>;
      result_info?: { cursor?: string; is_truncated?: boolean };
      errors?: Array<{ message: string }>;
    }>(
      `/accounts/${ACCOUNT_ID}/r2/buckets/${encodeURIComponent(BUCKET)}/objects?${query}`,
    );

    if (status >= 400 || !json?.success) {
      const message =
        json?.errors?.map((error) => error.message).join("; ") ||
        `R2 list failed (${status})`;
      throw new Error(message);
    }

    for (const item of json.result || []) {
      if (!item.key || item.key.endsWith("/")) {
        continue;
      }
      objects.set(item.key, {
        key: item.key,
        size: item.size,
        etag: item.etag,
      });
    }

    cursor = json.result_info?.is_truncated
      ? json.result_info.cursor
      : undefined;
  } while (cursor);

  return objects;
}

async function getObjectViaApi(key: string): Promise<Uint8Array> {
  const encodedKey = key
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  let attempt = 0;
  while (true) {
    attempt += 1;
    const { status, bytes, json, headers } = await cfApi(
      `/accounts/${ACCOUNT_ID}/r2/buckets/${encodeURIComponent(BUCKET)}/objects/${encodedKey}`,
    );

    if (status === 429 || status === 503) {
      if (attempt >= 8) {
        throw new Error(`R2 get failed for ${key} (${status}) after retries`);
      }
      const retryAfter = Number(headers.get("retry-after") || 0);
      const delayMs = Math.max(retryAfter * 1000, 250 * 2 ** (attempt - 1));
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    if (status >= 400 || !bytes) {
      const message =
        (json as { errors?: Array<{ message: string }> } | undefined)?.errors
          ?.map((error) => error.message)
          .join("; ") || `R2 get failed for ${key} (${status})`;
      throw new Error(message);
    }

    return bytes;
  }
}

async function pullArticlesViaApi(): Promise<number> {
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const remote = await listRemoteViaApi("articles/");
  let downloaded = 0;
  const concurrency = Math.min(CONCURRENCY, 4);

  await mapPool([...remote.values()], concurrency, async (obj) => {
    const name = obj.key.slice("articles/".length);
    if (!name || name.includes("..") || !name.endsWith(".md")) {
      return;
    }
    const localPath = join(ARTICLES_DIR, name);
    if (
      existsSync(localPath) &&
      statSync(localPath).size === obj.size &&
      etagMatches(localPath, obj.etag)
    ) {
      return;
    }

    const body = await getObjectViaApi(obj.key);
    mkdirSync(dirname(localPath), { recursive: true });
    writeFileSync(localPath, body);
    downloaded += 1;
    if (downloaded % 100 === 0) {
      console.log(`[pull] downloaded ${downloaded} article(s)...`);
    }
  });

  return downloaded;
}

async function pullCheckpointsViaApi(): Promise<boolean> {
  try {
    const body = await getObjectViaApi("checkpoints.json");
    mkdirSync(dirname(CHECKPOINTS_PATH), { recursive: true });
    writeFileSync(CHECKPOINTS_PATH, body);
    return true;
  } catch {
    return false;
  }
}

function etagMatches(localPath: string, etag?: string): boolean {
  if (!etag) {
    return false;
  }
  const normalized = etag.replaceAll('"', "").toLowerCase();
  try {
    const md5 = createHash("md5").update(readFileSync(localPath)).digest("hex");
    return md5 === normalized;
  } catch {
    return false;
  }
}

async function listRemote(
  client: S3Client,
  prefix: string,
): Promise<Map<string, RemoteObject>> {
  const objects = new Map<string, RemoteObject>();
  let continuationToken: string | undefined;

  do {
    const page = await client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const item of page.Contents || []) {
      if (!item.Key || item.Key.endsWith("/")) {
        continue;
      }
      objects.set(item.Key, {
        key: item.Key,
        size: item.Size,
        etag: item.ETag,
      });
    }

    continuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return objects;
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const current = next;
      next += 1;
      await worker(items[current]);
    }
  }
  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, Math.max(items.length, 1)) },
      () => run(),
    ),
  );
}

function localArticleFiles(): string[] {
  if (!existsSync(ARTICLES_DIR)) {
    return [];
  }
  return readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => join(ARTICLES_DIR, name));
}

async function pushArticles(client: S3Client): Promise<number> {
  const remote = await listRemote(client, "articles/");
  const localFiles = localArticleFiles();
  let uploaded = 0;

  await mapPool(localFiles, CONCURRENCY, async (filePath) => {
    const key = `articles/${relative(ARTICLES_DIR, filePath).replaceAll("\\", "/")}`;
    const remoteObj = remote.get(key);
    const size = statSync(filePath).size;

    if (
      remoteObj &&
      remoteObj.size === size &&
      etagMatches(filePath, remoteObj.etag)
    ) {
      return;
    }

    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: "text/markdown; charset=utf-8",
        ContentLength: size,
      }),
    );
    uploaded += 1;
    if (uploaded % 100 === 0) {
      console.log(`[push] uploaded ${uploaded} article(s)...`);
    }
  });

  return uploaded;
}

async function pullArticles(client: S3Client): Promise<number> {
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const remote = await listRemote(client, "articles/");
  let downloaded = 0;

  await mapPool([...remote.values()], CONCURRENCY, async (obj) => {
    const name = obj.key.slice("articles/".length);
    if (!name || name.includes("..") || !name.endsWith(".md")) {
      return;
    }
    const localPath = join(ARTICLES_DIR, name);
    if (
      existsSync(localPath) &&
      statSync(localPath).size === obj.size &&
      etagMatches(localPath, obj.etag)
    ) {
      return;
    }

    const response = await client.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: obj.key,
      }),
    );
    if (!response.Body) {
      throw new Error(`Empty body for ${obj.key}`);
    }

    mkdirSync(dirname(localPath), { recursive: true });
    await pipeline(response.Body as Readable, createWriteStream(localPath));
    downloaded += 1;
    if (downloaded % 100 === 0) {
      console.log(`[pull] downloaded ${downloaded} article(s)...`);
    }
  });

  return downloaded;
}

async function pushCheckpoints(client: S3Client): Promise<boolean> {
  if (!existsSync(CHECKPOINTS_PATH)) {
    return false;
  }
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: "checkpoints.json",
      Body: readFileSync(CHECKPOINTS_PATH),
      ContentType: "application/json; charset=utf-8",
    }),
  );
  return true;
}

async function pullCheckpoints(client: S3Client): Promise<boolean> {
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: "checkpoints.json",
      }),
    );
  } catch {
    return false;
  }

  const response = await client.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: "checkpoints.json",
    }),
  );
  if (!response.Body) {
    return false;
  }

  mkdirSync(dirname(CHECKPOINTS_PATH), { recursive: true });
  writeFileSync(
    CHECKPOINTS_PATH,
    Buffer.from(await response.Body.transformToByteArray()),
  );
  return true;
}

async function main() {
  const command = process.argv[2];
  if (command !== "push" && command !== "pull") {
    console.error("Usage: tsx scripts/content-r2.ts <pull|push>");
    process.exit(1);
  }

  if (command === "pull" && !canUseS3()) {
    console.log(
      "[pull] R2 S3 keys not set; using Cloudflare API token fallback.",
    );
    const checkpoints = await pullCheckpointsViaApi();
    const downloaded = await pullArticlesViaApi();
    console.log(
      `Pull complete. Articles downloaded: ${downloaded}. Checkpoints: ${checkpoints ? "yes" : "missing"}.`,
    );
    return;
  }

  const client = createClient();
  if (command === "push") {
    const uploaded = await pushArticles(client);
    const checkpoints = await pushCheckpoints(client);
    console.log(
      `Push complete. Articles uploaded: ${uploaded}. Checkpoints: ${checkpoints ? "yes" : "skipped"}.`,
    );
    return;
  }

  const checkpoints = await pullCheckpoints(client);
  const downloaded = await pullArticles(client);
  console.log(
    `Pull complete. Articles downloaded: ${downloaded}. Checkpoints: ${checkpoints ? "yes" : "missing"}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
