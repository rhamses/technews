# Technews

A minimalist RSS reader built with Astro and deployed on Cloudflare Workers. Feed sources live as markdown frontmatter files; each build (and a scheduled GitHub Action) ingests new items into an Astro content collection.

## Features

- Source files in `sources/` with required `site_name` and `site_feed`
- Incremental ingest with per-feed ETag / Last-Modified checkpoints
- Static article pages with light, dark, and system themes
- On-demand article translation via Cloudflare Workers AI
- Sitemap, SEO meta tags, icons, and an aggregated `/rss.xml` feed

## Getting started

```bash
npm install
npm run ingest
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run ingest` | Fetch feeds and write new articles + checkpoints |
| `npm run build` | Ingest, then build for Cloudflare Workers |
| `npm run generate-types` | Generate Wrangler/Worker env types |

## Adding a source

Create a markdown file in `sources/`:

```md
---
site_name: "Example"
site_feed: "https://example.com/feed.xml"
---
```

## Deploy

1. Connect this repository to Cloudflare Workers Builds (`npm run build`).
2. Ensure the Worker has an `AI` binding (already declared in `wrangler.jsonc`).
3. Keep the GitHub Action `.github/workflows/ingest.yml` enabled so ingested articles and checkpoints are committed back to the repo every 6 hours.
