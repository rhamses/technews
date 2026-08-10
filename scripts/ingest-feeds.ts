import { createHash } from "node:crypto";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { extract } from "@extractus/article-extractor";
import matter from "gray-matter";
import Parser from "rss-parser";

const ROOT = process.cwd();
const SOURCES_DIR = join(ROOT, "sources");
const ARTICLES_DIR = join(ROOT, "src", "content", "articles");
const CHECKPOINTS_PATH = join(ROOT, "data", "checkpoints.json");
const FETCH_TIMEOUT_MS = 15_000;
const MIN_ORIGINAL_CHARS = 280;
const ORIGINAL_FETCH_CONCURRENCY = 8;

type Checkpoint = {
  etag?: string;
  lastModified?: string;
  lastBuildDate?: string;
  checkedAt?: string;
};

type Checkpoints = Record<string, Checkpoint>;

type SourceFrontmatter = {
  site_name: string;
  site_feed: string;
  category: string;
};

type FeedItem = {
  title?: string;
  link?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  creator?: string;
  author?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  "content:encoded"?: string;
};

const parser = new Parser({
  customFields: {
    item: [["content:encoded", "contentEncoded"]],
  },
});

const articleFetcher = (url: string) =>
  fetch(url, {
    headers: {
      "User-Agent": "TechnewsRSSReader/1.0 (+https://technews.amb1.workers.dev)",
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

function loadCheckpoints(): Checkpoints {
  if (!existsSync(CHECKPOINTS_PATH)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(CHECKPOINTS_PATH, "utf8")) as Checkpoints;
  } catch {
    return {};
  }
}

function saveCheckpoints(checkpoints: Checkpoints) {
  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(CHECKPOINTS_PATH, `${JSON.stringify(checkpoints, null, 2)}\n`);
}

function slugifyId(value: string): string {
  const hash = createHash("sha256").update(value).digest("hex").slice(0, 16);
  const base = value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "article"}-${hash}`;
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

function yamlEscape(value: string): string {
  return JSON.stringify(value);
}

function htmlToPlain(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function preferLongerHtml(a?: string, b?: string): string | undefined {
  const aText = a ? htmlToPlain(a) : "";
  const bText = b ? htmlToPlain(b) : "";
  if (!aText && !bText) {
    return undefined;
  }
  if (aText.length >= bText.length) {
    return a || b;
  }
  return b || a;
}

async function fetchOriginalContent(url: string): Promise<string | undefined> {
  try {
    const extracted = await extract(url, {}, articleFetcher);
    const content = extracted?.content?.trim();
    if (!content) {
      return undefined;
    }

    const cleaned = sanitizeHtml(content);
    if (htmlToPlain(cleaned).length < MIN_ORIGINAL_CHARS) {
      return undefined;
    }

    return cleaned;
  } catch (error) {
    console.warn(
      `[fetch] ${url}:`,
      error instanceof Error ? error.message : error,
    );
    return undefined;
  }
}

function loadAllowedCategories(): Set<string> {
  const path = join(SOURCES_DIR, "_categories.md");
  if (!existsSync(path)) {
    throw new Error('Missing sources/_categories.md with allowed "categories"');
  }

  const { data } = matter(readFileSync(path, "utf8"));
  const categories = data.categories;

  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error('sources/_categories.md must define a non-empty "categories" list');
  }

  const allowed = new Set<string>();
  for (const category of categories) {
    if (typeof category !== "string" || !category.trim()) {
      throw new Error("sources/_categories.md: each category must be a non-empty string");
    }
    allowed.add(category.trim());
  }

  return allowed;
}

function loadSources(allowedCategories: Set<string>): SourceFrontmatter[] {
  if (!existsSync(SOURCES_DIR)) {
    return [];
  }

  return readdirSync(SOURCES_DIR)
    .filter((name) => name.endsWith(".md") && !name.startsWith("_"))
    .map((name) => {
      const raw = readFileSync(join(SOURCES_DIR, name), "utf8");
      const { data } = matter(raw);
      const site_name = data.site_name;
      const site_feed = data.site_feed;
      const category = data.category;

      if (typeof site_name !== "string" || !site_name.trim()) {
        throw new Error(`${name}: missing required frontmatter field "site_name"`);
      }
      if (typeof site_feed !== "string" || !site_feed.trim()) {
        throw new Error(`${name}: missing required frontmatter field "site_feed"`);
      }
      if (typeof category !== "string" || !category.trim()) {
        throw new Error(`${name}: missing required frontmatter field "category"`);
      }

      const normalizedCategory = category.trim();
      if (!allowedCategories.has(normalizedCategory)) {
        const allowed = [...allowedCategories].join(", ");
        throw new Error(
          `${name}: category "${normalizedCategory}" is not allowed. Use one of: ${allowed}`,
        );
      }

      return {
        site_name: site_name.trim(),
        site_feed: site_feed.trim(),
        category: normalizedCategory,
      };
    });
}

function articleExists(slug: string): boolean {
  return existsSync(join(ARTICLES_DIR, `${slug}.md`));
}

function writeArticle(params: {
  slug: string;
  title: string;
  link: string;
  guid: string;
  pubDate: Date;
  site_name: string;
  site_feed: string;
  category: string;
  summary?: string;
  author?: string;
  contentHtml?: string;
}) {
  const lines = [
    "---",
    `title: ${yamlEscape(params.title)}`,
    `link: ${yamlEscape(params.link)}`,
    `guid: ${yamlEscape(params.guid)}`,
    `pubDate: ${yamlEscape(params.pubDate.toISOString())}`,
    `site_name: ${yamlEscape(params.site_name)}`,
    `site_feed: ${yamlEscape(params.site_feed)}`,
    `category: ${yamlEscape(params.category)}`,
  ];

  if (params.summary) {
    lines.push(`summary: ${yamlEscape(params.summary)}`);
  }
  if (params.author) {
    lines.push(`author: ${yamlEscape(params.author)}`);
  }
  if (params.contentHtml) {
    lines.push(`contentHtml: ${yamlEscape(params.contentHtml)}`);
  }

  lines.push("---", "");
  if (params.summary) {
    lines.push(params.summary, "");
  }

  writeFileSync(join(ARTICLES_DIR, `${params.slug}.md`), lines.join("\n"));
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function run() {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await worker(items[current], current);
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => run(),
  );
  await Promise.all(runners);
  return results;
}

async function ingestFeed(
  source: SourceFrontmatter,
  checkpoints: Checkpoints,
): Promise<{ added: number; skipped: boolean; fetched: number }> {
  const checkpoint = checkpoints[source.site_feed] ?? {};
  const headers: Record<string, string> = {
    "User-Agent": "TechnewsRSSReader/1.0 (+https://technews.amb1.workers.dev)",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
  };

  if (checkpoint.etag) {
    headers["If-None-Match"] = checkpoint.etag;
  }
  if (checkpoint.lastModified) {
    headers["If-Modified-Since"] = checkpoint.lastModified;
  }

  const response = await fetch(source.site_feed, { headers });

  if (response.status === 304) {
    checkpoints[source.site_feed] = {
      ...checkpoint,
      checkedAt: new Date().toISOString(),
    };
    console.log(`[skip] ${source.site_name}: not modified`);
    return { added: 0, skipped: true, fetched: 0 };
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${source.site_name} (${source.site_feed}): ${response.status} ${response.statusText}`,
    );
  }

  const xml = await response.text();
  const feed = await parser.parseString(xml);
  const watermark = checkpoint.lastBuildDate
    ? new Date(checkpoint.lastBuildDate)
    : null;

  let newest = watermark;
  const pending: Array<{
    link: string;
    guid: string;
    slug: string;
    title: string;
    pubDate: Date;
    author?: string;
    feedHtml?: string;
    summaryHint?: string;
  }> = [];

  for (const raw of feed.items as Array<FeedItem & { contentEncoded?: string }>) {
    const link = raw.link?.trim();
    const guid = (raw.guid || link || raw.title || "").toString().trim();
    if (!guid || !link) {
      continue;
    }

    const pubDate = new Date(raw.isoDate || raw.pubDate || Date.now());
    if (Number.isNaN(pubDate.getTime())) {
      continue;
    }

    if (watermark && pubDate <= watermark) {
      continue;
    }

    const slug = slugifyId(guid);
    if (articleExists(slug)) {
      if (!newest || pubDate > newest) {
        newest = pubDate;
      }
      continue;
    }

    const rawHtml =
      raw.contentEncoded ||
      raw["content:encoded"] ||
      raw.content ||
      raw.summary ||
      raw.contentSnippet ||
      "";

    pending.push({
      link,
      guid,
      slug,
      title: (raw.title || "Untitled").trim(),
      pubDate,
      author: (raw.creator || raw.author || "").trim() || undefined,
      feedHtml: rawHtml ? sanitizeHtml(rawHtml) : undefined,
      summaryHint: raw.contentSnippet?.trim() || undefined,
    });

    if (!newest || pubDate > newest) {
      newest = pubDate;
    }
  }

  const results = await mapPool(pending, ORIGINAL_FETCH_CONCURRENCY, async (item) => {
    const originalHtml = await fetchOriginalContent(item.link);
    const contentHtml = preferLongerHtml(originalHtml, item.feedHtml);
    const summary =
      item.summaryHint ||
      (contentHtml ? htmlToPlain(contentHtml).slice(0, 280) : undefined);

    writeArticle({
      slug: item.slug,
      title: item.title,
      link: item.link,
      guid: item.guid,
      pubDate: item.pubDate,
      site_name: source.site_name,
      site_feed: source.site_feed,
      category: source.category,
      summary,
      author: item.author,
      contentHtml,
    });

    return { fetched: Boolean(originalHtml) };
  });

  const added = results.length;
  const fetched = results.filter((result) => result.fetched).length;

  const feedBuildDate = feed.lastBuildDate
    ? new Date(feed.lastBuildDate)
    : newest;

  checkpoints[source.site_feed] = {
    etag: response.headers.get("etag") ?? checkpoint.etag,
    lastModified:
      response.headers.get("last-modified") ?? checkpoint.lastModified,
    lastBuildDate: feedBuildDate
      ? feedBuildDate.toISOString()
      : checkpoint.lastBuildDate,
    checkedAt: new Date().toISOString(),
  };

  console.log(
    `[ok] ${source.site_name}: +${added} article(s), fetched ${fetched} original(s)`,
  );
  return { added, skipped: false, fetched };
}

async function main() {
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const allowedCategories = loadAllowedCategories();
  const sources = loadSources(allowedCategories);

  if (sources.length === 0) {
    console.log("No sources found in sources/");
    return;
  }

  const checkpoints = loadCheckpoints();
  let totalAdded = 0;
  let totalFetched = 0;

  for (const source of sources) {
    try {
      const result = await ingestFeed(source, checkpoints);
      totalAdded += result.added;
      totalFetched += result.fetched;
      saveCheckpoints(checkpoints);
    } catch (error) {
      console.error(
        `[error] ${source.site_name}:`,
        error instanceof Error ? error.message : error,
      );
      saveCheckpoints(checkpoints);
    }
  }

  console.log(
    `Ingest complete. Added ${totalAdded} article(s), fetched ${totalFetched} original page(s) from ${sources.length} source(s).`,
  );

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `added=${totalAdded}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
