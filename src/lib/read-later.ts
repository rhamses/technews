import { env } from "cloudflare:workers";
import {
  extractArticleFromUrl,
  readLaterKvKey,
  toReadLaterCard,
  type ExtractedArticle,
  type ReadLaterCachePayload,
  type ReadLaterCard,
  READ_LATER_KV_TTL_SECONDS,
} from "./extract-article";
import {
  estimateReadingMinutes,
  formatReadingTime,
} from "./reading-time";

export type ReadLaterRow = {
  article_id: string;
  source_url: string;
  title: string;
  site_name: string | null;
  author: string | null;
  summary: string | null;
  pub_date: string | null;
  saved_at: string;
};

function rowToCard(row: ReadLaterRow): ReadLaterCard {
  return {
    id: row.article_id,
    title: row.title,
    site_name: row.site_name || "Unknown",
    category: "Read later",
    readingTime: formatReadingTime(
      estimateReadingMinutes([row.summary]),
    ),
    pubDate: row.pub_date || row.saved_at,
    url: `/read-later/${row.article_id}/`,
    source_url: row.source_url,
    author: row.author || undefined,
    summary: row.summary || undefined,
  };
}

export async function putReadLaterCache(article: ExtractedArticle) {
  const payload: ReadLaterCachePayload = article;
  await env.ARTICLE_CACHE.put(
    readLaterKvKey(article.id),
    JSON.stringify(payload),
    { expirationTtl: READ_LATER_KV_TTL_SECONDS },
  );
}

export async function getReadLaterCache(
  articleId: string,
): Promise<ReadLaterCachePayload | null> {
  const raw = await env.ARTICLE_CACHE.get(readLaterKvKey(articleId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as ReadLaterCachePayload;
  } catch {
    return null;
  }
}

export async function upsertReadLaterArticle(
  userId: string,
  article: ExtractedArticle,
) {
  const savedAt = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO read_later_articles (
      user_id, article_id, source_url, title, site_name, author, summary, pub_date, saved_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, article_id) DO UPDATE SET
      source_url = excluded.source_url,
      title = excluded.title,
      site_name = excluded.site_name,
      author = excluded.author,
      summary = excluded.summary,
      pub_date = excluded.pub_date,
      saved_at = excluded.saved_at`,
  )
    .bind(
      userId,
      article.id,
      article.sourceUrl,
      article.title,
      article.site_name,
      article.author ?? null,
      article.summary ?? null,
      article.pubDate,
      savedAt,
    )
    .run();
}

export async function listReadLaterArticles(
  userId: string,
): Promise<ReadLaterCard[]> {
  const result = await env.DB.prepare(
    `SELECT article_id, source_url, title, site_name, author, summary, pub_date, saved_at
     FROM read_later_articles
     WHERE user_id = ?
     ORDER BY saved_at DESC`,
  )
    .bind(userId)
    .all<ReadLaterRow>();

  return (result.results ?? []).map(rowToCard);
}

export async function deleteReadLaterArticle(
  userId: string,
  articleId: string,
) {
  if (!articleId) {
    return;
  }
  await env.DB.prepare(
    `DELETE FROM read_later_articles WHERE user_id = ? AND article_id = ?`,
  )
    .bind(userId, articleId)
    .run();
}

export async function upsertReadLaterItems(
  userId: string,
  items: ReadLaterCard[],
) {
  const unique = new Map<string, ReadLaterCard>();
  for (const item of items) {
    if (!item?.id || !item.source_url || !item.title) {
      continue;
    }
    unique.set(item.id, item);
  }

  if (unique.size === 0) {
    return;
  }

  const now = new Date().toISOString();
  const statements = [...unique.values()].map((item) =>
    env.DB.prepare(
      `INSERT INTO read_later_articles (
        user_id, article_id, source_url, title, site_name, author, summary, pub_date, saved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, article_id) DO UPDATE SET
        source_url = excluded.source_url,
        title = excluded.title,
        site_name = excluded.site_name,
        author = excluded.author,
        summary = excluded.summary,
        pub_date = excluded.pub_date,
        saved_at = excluded.saved_at`,
    ).bind(
      userId,
      item.id,
      item.source_url,
      item.title,
      item.site_name || null,
      item.author ?? null,
      item.summary ?? null,
      item.pubDate || now,
      now,
    ),
  );

  await env.DB.batch(statements);
}

export async function findSourceUrlByArticleId(
  articleId: string,
): Promise<string | null> {
  const row = await env.DB.prepare(
    `SELECT source_url FROM read_later_articles WHERE article_id = ? LIMIT 1`,
  )
    .bind(articleId)
    .first<{ source_url: string }>();
  return row?.source_url ?? null;
}

export async function loadOrReextractArticle(
  articleId: string,
  fallbackSourceUrl?: string | null,
): Promise<ExtractedArticle | null> {
  const cached = await getReadLaterCache(articleId);
  if (cached && cached.contentHtml) {
    return cached;
  }

  const sourceUrl =
    fallbackSourceUrl || (await findSourceUrlByArticleId(articleId));
  if (!sourceUrl) {
    return null;
  }

  const extracted = await extractArticleFromUrl(sourceUrl);
  // Keep the requested id stable even if normalization drifts slightly.
  const article = { ...extracted, id: articleId };
  await putReadLaterCache(article);
  return article;
}

export async function ingestReadLaterUrl(
  rawUrl: string,
  userId?: string | null,
): Promise<ReadLaterCard> {
  const article = await extractArticleFromUrl(rawUrl);
  await putReadLaterCache(article);
  if (userId) {
    await upsertReadLaterArticle(userId, article);
  }
  return toReadLaterCard(article);
}
