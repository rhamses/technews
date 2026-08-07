import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({
    base: "./src/content/articles",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    link: z.string().url(),
    guid: z.string(),
    pubDate: z.coerce.date(),
    site_name: z.string(),
    site_feed: z.string().url(),
    category: z.string(),
    summary: z.string().optional(),
    author: z.string().optional(),
    contentHtml: z.string().optional(),
  }),
});

export const collections = { articles };
