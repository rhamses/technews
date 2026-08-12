import { extract } from "@extractus/article-extractor";
import {
  estimateReadingMinutes,
  formatReadingTime,
} from "./reading-time";

const FETCH_TIMEOUT_MS = 15_000;
const MIN_CONTENT_CHARS = 280;

export const READ_LATER_KV_PREFIX = "read-later:";
export const READ_LATER_KV_TTL_SECONDS = 90 * 24 * 60 * 60;

export type ExtractedArticle = {
  id: string;
  sourceUrl: string;
  title: string;
  site_name: string;
  author?: string;
  summary?: string;
  pubDate: string;
  contentHtml: string;
};

export type ReadLaterCachePayload = ExtractedArticle;

export type ReadLaterCard = {
  id: string;
  title: string;
  site_name: string;
  category: string;
  readingTime: string;
  pubDate: string;
  url: string;
  source_url: string;
  author?: string;
  summary?: string;
};

const articleFetcher = (url: string) =>
  fetch(url, {
    headers: {
      "User-Agent": "TechnewsRSSReader/1.0 (+https://technews.amb1.workers.dev)",
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

export function htmlToPlain(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeArticleUrl(raw: string): string {
  const url = new URL(raw.trim());
  url.hash = "";
  if (
    (url.protocol === "http:" && url.port === "80") ||
    (url.protocol === "https:" && url.port === "443")
  ) {
    url.port = "";
  }
  // Drop common tracking params
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid|gclid|mc_)/i.test(key)) {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

export async function articleIdFromUrl(rawUrl: string): Promise<string> {
  const normalized = normalizeArticleUrl(rawUrl);
  const data = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hash = [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
  const base = normalized
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "article"}-${hash}`;
}

function siteNameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Unknown";
  }
}

export function toReadLaterCard(article: ExtractedArticle): ReadLaterCard {
  return {
    id: article.id,
    title: article.title,
    site_name: article.site_name,
    category: "Read later",
    readingTime: formatReadingTime(
      estimateReadingMinutes([article.contentHtml, article.summary]),
    ),
    pubDate: article.pubDate,
    url: `/read-later/${article.id}/`,
    source_url: article.sourceUrl,
    author: article.author,
    summary: article.summary,
  };
}

export async function extractArticleFromUrl(
  rawUrl: string,
): Promise<ExtractedArticle> {
  let normalized: string;
  try {
    normalized = normalizeArticleUrl(rawUrl);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!/^https?:$/i.test(new URL(normalized).protocol)) {
    throw new Error("Only http(s) URLs are supported");
  }

  const extracted = await extract(normalized, {}, articleFetcher);
  if (!extracted) {
    throw new Error("Could not extract article content from that URL");
  }

  const content = extracted.content?.trim();
  if (!content) {
    throw new Error("Could not extract article content from that URL");
  }

  const contentHtml = sanitizeHtml(content);
  if (htmlToPlain(contentHtml).length < MIN_CONTENT_CHARS) {
    throw new Error("Extracted content was too short to save");
  }

  const id = await articleIdFromUrl(normalized);
  const title =
    extracted.title?.trim() ||
    htmlToPlain(contentHtml).slice(0, 120) ||
    "Untitled article";
  const author = extracted.author?.trim() || undefined;
  const summary =
    extracted.description?.trim() ||
    htmlToPlain(contentHtml).slice(0, 280) ||
    undefined;
  const pubDate = extracted.published
    ? new Date(extracted.published).toISOString()
    : new Date().toISOString();

  if (Number.isNaN(new Date(pubDate).getTime())) {
    throw new Error("Could not parse publication date");
  }

  return {
    id,
    sourceUrl: normalized,
    title,
    site_name: siteNameFromUrl(normalized),
    author,
    summary,
    pubDate,
    contentHtml,
  };
}

export function readLaterKvKey(articleId: string) {
  return `${READ_LATER_KV_PREFIX}${articleId}`;
}
