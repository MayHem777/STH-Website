# STH-Website — Claude Code Context

Rebuild of sunshinetinyhouses.com.au replacing Squarespace.

## Stack
- **Framework:** Astro (static output)
- **CMS:** Decap CMS at `/admin/` — GitHub-backed, edits = commits
- **Hosting:** Cloudflare Pages (auto-deploy from `main` branch)
- **OAuth:** Cloudflare Worker proxy for Decap CMS GitHub login

## Business
- Name: Sunshine Tiny Houses
- Address: 24 Venture Drive, Noosaville QLD 4566
- Phone: (07) 5315 8365 | Email: hello@sunshinetinyhouses.com.au
- ABN: 40 270 427 080 | QBCC: #15205110
- Socials: @sunshinetinyhouses (Instagram, Facebook, YouTube)

## Product lines
| Line | Class | URL prefix |
|------|-------|-----------|
| Tiny Houses on Wheels | 1a | `/tiny-houses-on-wheels/` |
| Modular Homes & Granny Flats | 1a | `/modular-homes/` |
| Backyard Studios | 10a | `/backyard-studios/` |

## Dev commands
```bash
npm run dev       # local dev server (localhost:4321)
npm run build     # static build → dist/
npm run preview   # preview built site
```

## Content structure
```
src/content/
  products-thow/      ← one .md per THOW model (9 models)
  products-modular/   ← one .md per Modular model (8 models)
  products-class10a/  ← one .md per Class 10a product (3 products)
  pages/              ← static pages (about, faq, finance, etc.)
  blog/               ← blog posts
  config.ts           ← Content Collections schema (typed frontmatter)
```

## Draft system
Every content file has `draft: true/false` in frontmatter.
`draft: true` = hidden from build, nav, and sitemap.
In Decap CMS this appears as a "Published" toggle — flip to publish.

## Design tokens
All design tokens live in `src/styles/tokens.css`.
⚠️ Colour palette + fonts are PLACEHOLDER — update from brand screenshots.
Send screenshots of /google-ads-offer and /meta-ads-offer to extract exact values.

## Key files
- `src/styles/tokens.css` — all design tokens (update colours here)
- `src/styles/global.css` — base reset + typography
- `src/layouts/BaseLayout.astro` — wraps every page
- `src/components/SEOHead.astro` — title, description, OG, schema.org
- `src/components/Header.astro` — sticky nav with mobile hamburger
- `src/components/Footer.astro` — address, socials, badges
- `public/admin/config.yml` — Decap CMS field definitions
- `public/_redirects` — Cloudflare Pages 301 redirects

## CMS login (for non-technical editor)
1. Go to `https://www.sunshinetinyhouses.com.au/admin/`
2. Click "Login with GitHub"
3. Approve the OAuth pop-up (first time only)
4. Edit any page → Save → site rebuilds in ~30 seconds

⚠️ OAuth Worker URL in `public/admin/config.yml` needs updating after Worker deploy.
Replace `https://sth-oauth.YOUR-SUBDOMAIN.workers.dev` with the actual Worker URL.

## Open items before launch
1. **Design tokens** — screenshots of /google-ads-offer + /meta-ads-offer needed
2. **URL redirect list** — full Squarespace URL list for complete `_redirects` mapping
3. **Cloudflare Worker OAuth** — deploy Worker, update config.yml base_url
4. **Cloudflare Pages** — connect GitHub repo, build command: `npm run build`, output: `dist`
5. **Contact form** — decide email delivery method (Cloudflare Email Workers or mailto)
6. **Content** — product descriptions, images, and supporting page copy
7. **DNS cut-over** — final step after everything is verified on preview URL

## GitHub
Repo: `github.com/mitchjcroft/STH-Website`
Note: GitHub remote not yet added — add with `git remote add origin <url>`

## Astro dev server
```bash
astro dev --background   # start in background
astro dev stop           # stop background server
astro dev logs           # view logs
```
