# PLAN.md: STH-Website

## Goal
Replace the Squarespace sunshinetinyhouses.com.au with this Astro + Decap CMS site on Cloudflare Pages, then grow organic traffic with useful, STH-specific guides.

## Next steps
- **Branch `launch-prep` (2026-10-17) = everything ready for launch in one place**: merged about-page, site-content-upgrade, redirect-gaps and blog-foundations-guide, plus: two-door home page (from the Squarespace home), numbered photo spots (PHOTOS.md, /photo-spots/, red labels on preview builds only), contact form attribution, audit fixes. Preview: launch-prep.sth-website.pages.dev. Mitch merges it into main via GitHub when happy (the box can't push to main).
- Nat fills a folder of numbered photos → `node scripts/import-photos.mjs "<folder>"` → build → check preview → commit to launch-prep.
- DNS cutover (items in the global projects list; all with Mitch).
- Foundations guide (`src/content/blog/how-foundations-work-for-modular-homes.md`, branch `blog-foundations-guide`): text final per Mitch 2026-10-02, linked from FAQ + delivery page. Next: add 2–4 photos (piles/piers, crane set-down, subfloor) + real hero image, then merge to main (needs Mitch's OK).
- Gallery page still "Photos Coming Soon".

## Assumptions
- 2026-10-17 (Mitch): hours Mon–Fri 7am–4pm, Saturday by appointment; every direct email address on the site is hello@.
- 2026-10-17: photo spots keep today's photo until Nat supplies one; empty spots (THOW galleries, gallery page) stay hidden on production until filled. Spot numbers are permanent once Nat has the list.
- 2026-10-17: merge conflicts in modular model files resolved to the October brochure versions (site-content-upgrade).
- 2026-10-17: contact form budget options cut to the same 8 as the landing pages (HubSpot drops values it doesn't know).
- 2026-10-17: FAQ tiny house prices changed to match the model pages ($59,500 lock-up / $115,000 turn-key, 1770). Needs Mitch's OK before launch.
- 2026-10-02: Foundations post covers modular homes only (Mitch); FAQ + delivery page wording aligned to "screw piles or concrete bored piers".
- 2026-10-02: Foundations piece is a blog post (matches the existing blog collection), written from scratch in our own words, inspired by ach.net.au's foundations article but copying none of its text or its build-specific numbers.
- 2026-10-02: STH-specific facts not already on the site are marked [CONFIRM] rather than guessed.

## Waiting on Mitch
- OK the FAQ price wording; pricing-guide page says "from $110k / studios from $110k" but Ensuite and Office are listed at $100,000: which is right?
- Merge `launch-prep` into main on GitHub.
- Foundations guide: photos, then OK to merge to main.
- DNS cutover checklist items.
