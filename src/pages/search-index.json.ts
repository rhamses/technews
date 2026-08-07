import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const GET: APIRoute = async () => {
  const articles = (await getCollection("articles")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = articles.map((article) => {
    const body = article.data.contentHtml
      ? stripHtml(article.data.contentHtml)
      : article.data.summary || "";

    return {
      id: article.id,
      title: article.data.title,
      site_name: article.data.site_name,
      summary: article.data.summary || body.slice(0, 180),
      author: article.data.author || "",
      pubDate: article.data.pubDate.toISOString(),
      url: `/article/${article.id}/`,
      text: [article.data.title, article.data.site_name, article.data.author, body]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });

  return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), items }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
};
