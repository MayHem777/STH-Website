# Handover — 2026-07-03 session

Session covered: CMS/forms/blog audit (see conversation), then implementation
of the 6 items from that audit, plus earlier same-session work (modular home
category pages, hero card alignment). Everything below is committed and
pushed to `origin/main`. Working tree is clean.

## What was completed

1. **GA4 on ad landing pages** — `/google-ads-offer/` and `/meta-ads-offer/`
   use `LandingLayout`, which never had GA4. Added it there; removed the
   duplicate inline GA4 snippet that `google-ads-offer.astro` had (would have
   double-fired `gtag('config', ...)` otherwise). Verified GA4 fires exactly
   once per page across all four layouts/pages that carry it.

2. **Meta Pixel made global** — moved from `meta-ads-offer.astro` only into
   `BaseLayout` + `LandingLayout`, so it now fires site-wide for
   retargeting/lookalike audiences, not just on Meta ad clicks.

3. **New 2-step conditional contact form** (`src/pages/contact.astro`) —
   replaces the old single-step `hbspt.forms.create()` embed. Step 1: THOW /
   Modular / Not Sure Yet cards. Step 2: shared fields + conditional fields.
   Submits via client-side `fetch()` to HubSpot's Forms Submission API
   (portal `442170069`, form `a2d006e2-82f7-4577-b4af-23fc9e248c20`), same
   pattern as the existing ad landing pages. **Field names and dropdown
   options were verified directly against the live HubSpot contact
   properties via the HubSpot MCP tools** — not guessed.

4. **Blog SEO** — `BlogPosting` schema.org JSON-LD added to
   `blog/[slug].astro` (via the existing `SEOHead` `schema` prop). Optional
   `updatedDate` field added to the blog schema + CMS form, rendered as
   "Updated on X" next to the publish date when set. `ogImage` exposed in the
   CMS blog form (schema already supported it, form didn't).

5. **Removed the `tags` field from blog** entirely — schema, CMS form, and
   both existing posts' frontmatter. It was captured but never rendered
   anywhere. Re-add later if tag archive pages are actually wanted.

6. **Removed `@astrojs/cloudflare` dependency** — unused (site is
   `output: 'static'`, no adapter wired). `wrangler` itself stays (used for
   type generation and the OAuth worker deploy).

7. **From earlier in the session** (already committed, not from the 6-item
   list): split the old combined `1-bedroom.md` / `2-bedroom.md` modular
   products into individual model entries (Bunya, Straddie×2, Rio, Pandanus,
   Daintree, Jacaranda) with proper `/modular-homes/1-bedroom/` and
   `/modular-homes/2-bedroom/` category listing pages, plus a hero card
   alignment fix on the homepage.

A concurrent commit landed on `origin/main` mid-session
(`cdd3fdf — Add full SEO layer: geo tags, FAQPage schema, BreadcrumbList,
product schema`, presumably from another Claude Code instance/session) and
was merged in cleanly — one shared file (`modular-homes/[slug].astro`)
touched by both sides but on non-overlapping lines, so it was a trivial
auto-merge. Verified with a full `npm run build` after merging.

## Flagged but NOT fixed (needs your input)

- **No Google Ads conversion tag anywhere in the repo.** Only the bare GA4
  property tag (`G-E2818PQ3H9`) exists. That's the likely root cause of any
  Google Ads conversion tracking gaps you've been chasing — GA4 alone doesn't
  report conversions to Google Ads without either a dedicated
  `gtag('event', 'conversion', {...})` fire (needs your Conversion ID/label)
  or a GA4-to-Google-Ads Admin-side link with a marked key event. Didn't
  implement since I don't have your Conversion ID.

- **HubSpot dropdown options vs. actual site content don't fully match.**
  `pod_home_design` (HubSpot) offers Banksia, Fingal, Bunya, Straddie,
  Pandanus, Daintree, Custom Design — but the site's modular-homes content
  only has Bunya, Straddie, Rio, Pandanus (1-bed) and Daintree, Straddie,
  Jacaranda (2-bed). Banksia/Fingal don't exist as site content; Rio/
  Jacaranda aren't in the HubSpot dropdown. `thow_design` does fully match
  the site's THOW models. Worth reconciling at some point — not done here,
  out of scope for this session.

## Not yet tested

- The new contact form has **not been submitted end-to-end in a real
  browser** — only verified via `curl`/build output that it renders with the
  right field names, GUID, and structure. Before relying on it for real
  leads, submit a real test enquiry on the live/preview site and confirm it
  lands in HubSpot correctly (check both the THOW path and the Modular path
  to exercise both conditional field blocks).

## Still open from before this session

- DNS cutover (sunshinetinyhouses.com.au → this site) — unrelated to
  tonight's work, still the final step before this replaces the live
  Squarespace/Google Ads landing page.

## Repo state

- Branch: `main`, clean, pushed to `origin/main`.
- Dev server dependencies installed via `apt`/`npm` this session (Node
  wasn't previously available natively in this WSL environment — only
  Windows-side Node was on PATH).
- `~/.claude/CLAUDE.md` (dotfiles-symlinked project list) updated to reflect
  STH-Website's current "Next" items; auto-synced to GitHub by the existing
  dotfiles PostToolUse hook already (no manual push needed there).
