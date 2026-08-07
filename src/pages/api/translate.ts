export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

const MAX_CHARS = 12_000;
const CHUNK_SIZE = 1_800;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "english",
  es: "spanish",
  fr: "french",
  de: "german",
  pt: "portuguese",
  it: "italian",
  nl: "dutch",
  ru: "russian",
  ja: "japanese",
  zh: "chinese",
  hi: "hindi",
  ar: "arabic",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function chunkText(text: string, size: number): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > 0) {
    if (remaining.length <= size) {
      chunks.push(remaining);
      break;
    }

    let cut = remaining.lastIndexOf("\n", size);
    if (cut < size * 0.4) {
      cut = remaining.lastIndexOf(" ", size);
    }
    if (cut < size * 0.4) {
      cut = size;
    }

    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }

  return chunks.filter(Boolean);
}

function resolveLanguage(code: string | undefined, fallback: string) {
  if (!code) {
    return fallback;
  }
  const normalized = code.trim().toLowerCase();
  return LANGUAGE_NAMES[normalized] || normalized;
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return json({ error: "Forbidden origin." }, 403);
      }
    } catch {
      return json({ error: "Invalid origin." }, 403);
    }
  }

  let body: {
    text?: unknown;
    title?: unknown;
    source_lang?: unknown;
    target_lang?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const targetLangRaw =
    typeof body.target_lang === "string" ? body.target_lang : "";
  const sourceLangRaw =
    typeof body.source_lang === "string" ? body.source_lang : "en";

  if (!text) {
    return json({ error: "Missing text." }, 400);
  }
  if (!targetLangRaw) {
    return json({ error: "Missing target_lang." }, 400);
  }
  if (text.length > MAX_CHARS) {
    return json(
      { error: `Text exceeds ${MAX_CHARS} character limit.` },
      413,
    );
  }

  const source_lang = resolveLanguage(sourceLangRaw, "english");
  const target_lang = resolveLanguage(targetLangRaw, "");

  if (!target_lang) {
    return json({ error: "Invalid target_lang." }, 400);
  }

  if (!env.AI) {
    return json({ error: "Workers AI binding is unavailable." }, 503);
  }

  async function translateChunk(chunk: string) {
    const result = await env.AI.run("@cf/meta/m2m100-1.2b", {
      text: chunk,
      source_lang,
      target_lang,
    });

    if (typeof result === "string") {
      return result;
    }
    if (
      result &&
      typeof result === "object" &&
      "translated_text" in result &&
      typeof result.translated_text === "string"
    ) {
      return result.translated_text;
    }
    throw new Error("Unexpected translation response.");
  }

  try {
    const translatedChunks: string[] = [];
    for (const chunk of chunkText(text, CHUNK_SIZE)) {
      translatedChunks.push(await translateChunk(chunk));
    }

    let translatedTitle = title;
    if (title) {
      translatedTitle = await translateChunk(title);
    }

    return json({
      title: translatedTitle,
      text: translatedChunks.join("\n\n"),
      source_lang,
      target_lang,
    });
  } catch (error) {
    console.error("translate failed", error);
    return json({ error: "Translation failed." }, 502);
  }
};
