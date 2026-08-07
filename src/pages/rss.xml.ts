import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export async function GET(context: APIContext) {
  const articles = (await getCollection("articles")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: "Technews",
    description: "A minimalist RSS reader for technology headlines.",
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.summary || article.data.title,
      pubDate: article.data.pubDate,
      link: `/article/${article.id}/`,
      categories: [article.data.site_name],
    })),
    customData: `<language>en-us</language>`,
  });
}
