# STH-Website — Claude Code Context

---

## 🚫 DNS CUTOVER — NON-NEGOTIABLE PRE-FLIGHT CHECK

TRIGGER CONDITION: Before offering ANY advice, opinion, or next steps in
response to a message that touches on DNS cutover, going live, launching,
"switching over," pointing the domain, or anything that implies the
production site is about to become the live site — your FIRST action, before
any other response, must be to run the checklist below against actual repo
state and report status. Do not answer the substance of the question first
and mention the checklist after. Do not wait to be asked "what's the
checklist" — surface it unprompted the moment the topic comes up.

This applies even if Mitch's message sounds casual or exploratory (e.g.
"thinking about going live soon", "when should we switch DNS", "is the site
ready"), not just explicit launch commands.

Checklist — verify against real repo state, don't assume:
1. [ ] Full 301 redirect map built and implemented (old Squarespace URLs →
   new URLs), covering every URL in the Squarespace sitemap.xml and every
   URL with traffic/backlinks per Google Search Console
2. [ ] Redirect map validated — no orphaned old URLs, no redirect chains,
   all redirects are 301 (permanent), not 302
3. [ ] Staging noindex confirmed removed / production robots meta confirmed
   set to index, follow on the live domain
4. [ ] New sitemap.xml generated and ready to submit to GSC immediately
   post-launch
5. [ ] Full SEO audit pass completed (meta titles/descriptions, schema.org
   markup, heading hierarchy, alt text)
6. [ ] Core Web Vitals checked on production build — confirm equal to or
   better than the current Squarespace site
7. [ ] Final manual review of the old-URL → new-URL table done by Mitch —
   requires his explicit sign-off, not just Claude Code completion
8. [ ] Email deliverability (MX records) — Confirm whether this DNS cutover
   involves a nameserver/DNS provider change. If so, explicitly identify and
   preserve the current MX records for hello@sunshinetinyhouses.com.au and
   info@sunshinetinyhouses.com.au before cutover. HARD BLOCKER — losing
   inbound email breaks the Outlook enquiry auto-draft system and HubSpot
   lead notifications silently, with no visible error. Post-cutover, a test
   email to both addresses must be sent and confirmed received before this
   is ticked off.
9. [ ] SSL/TLS certificate — Confirm Cloudflare Pages has issued and
   activated a valid certificate for the apex domain and www subdomain
   BEFORE DNS points there, so there's no window where visitors hit a
   certificate warning.
10. [ ] Form/tracking endpoint live test — After DNS cutover (or on a
    production preview matching the final domain), submit one real test
    enquiry through the live HubSpot form and confirm it lands in HubSpot.
    Confirm GA4 and Meta Pixel events fire correctly from the production
    domain, not just from the .pages.dev staging domain — some analytics
    configs are domain-scoped and can silently break on a domain change.
11. [ ] DNS TTL lowered pre-cutover — Confirm the TTL on current DNS records
    has been lowered at least 24-48 hours before the planned cutover, so a
    rollback (if needed) can propagate quickly rather than taking a full day
    or more.
12. [ ] Rollback plan documented — A written, specific rollback plan must
    exist (e.g. "revert A/CNAME records to X, previous Squarespace site
    remains accessible at Y") before cutover, not improvised after something
    breaks.
13. [ ] Directory/listing URL check — Confirm Google Business Profile, QBCC
    listing, and any other external directories linking to specific old page
    URLs are updated or unaffected post-migration. (Lower priority than
    items 8-12, but should be checked, not skipped.)

After reporting checklist status: if anything is incomplete, say so plainly
and do not proceed with DNS/launch actions or advice on how to do them until
Mitch has seen the gap and explicitly said he wants to proceed anyway despite
it. Items 1/2 (redirect completeness), 7 (Mitch sign-off), and 8 (MX
records) are treated with equal severity — a broken MX record is a silent
business-critical failure, not just an SEO risk. Only once all 13 items are
checked off (or explicitly overridden by Mitch) should you engage normally
with DNS cutover questions.

---

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
Repo: `github.com/MayHem777/STH-Website`
Remote: `https://github.com/MayHem777/STH-Website.git` (already set)

## Astro dev server
```bash
astro dev --background   # start in background
astro dev stop           # stop background server
astro dev logs           # view logs
```
