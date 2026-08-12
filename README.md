# Technews

A minimalist RSS reader built with Astro and deployed on Cloudflare Workers. Feed sources live as markdown frontmatter files; ingest writes articles into an Astro content collection stored in Cloudflare R2, then the site is built and deployed.

## Features

- Source files in `sources/` with required `site_name` and `site_feed`
- Incremental ingest with per-feed ETag / Last-Modified checkpoints in R2
- Article markdown corpus stored in the `technews-content` R2 bucket (not in Git)
- Static article pages with light, dark, and system themes
- On-demand article translation via Cloudflare Workers AI
- Sitemap, SEO meta tags, icons, and an aggregated `/rss.xml` feed

## Getting started

```bash
npm install
# Requires R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, CLOUDFLARE_ACCOUNT_ID
npm run content:pull
npm run ingest
npm run content:push
npm run dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run content:pull` | Download articles + checkpoints from R2 |
| `npm run ingest` | Fetch feeds and write new local articles + checkpoints |
| `npm run content:push` | Upload new/changed articles + checkpoints to R2 |
| `npm run build` | Build for Cloudflare Workers (expects local articles present) |
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

Production: **https://technews.rhams.es/** (also `technews.amb1.workers.dev`; path `rhams.es/technews*` is managed as a Workers route outside Wrangler because the build token lacks zone permissions)

1. Ensure GitHub secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `PUSH_NOTIFY_SECRET` are set.
2. Keep Worker secrets `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, and `PUSH_NOTIFY_SECRET`.
3. Keep Worker bindings in `wrangler.jsonc` (`AI`, `DB`, `SESSION`, `CONTENT`).
4. Keep `.github/workflows/ingest.yml` enabled — hourly it pulls from R2, ingests feeds, pushes back to R2, builds, deploys, and notifies push subscribers with the new-article count.
5. Visitors can enable push via the bell icon in the header (PWA install + splash use `/manifest.webmanifest` and `/icons`).
