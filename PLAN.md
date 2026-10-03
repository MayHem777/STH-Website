# PLAN.md: STH-Website

## Goal
Replace the Squarespace sunshinetinyhouses.com.au with this Astro + Decap CMS site on Cloudflare Pages, then grow organic traffic with useful, STH-specific guides.

## Next steps
- DNS cutover (items in the global projects list; all with Mitch).
- Foundations guide (`src/content/blog/how-foundations-work-for-modular-homes.md`, branch `blog-foundations-guide`): text final per Mitch 2026-10-02, linked from FAQ + delivery page. Next: add 2–4 photos (piles/piers, crane set-down, subfloor) + real hero image, then merge to main (needs Mitch's OK).
- Gallery page still "Photos Coming Soon".

## Assumptions
- 2026-10-02: Foundations post covers modular homes only (Mitch); FAQ + delivery page wording aligned to "screw piles or concrete bored piers".
- 2026-10-02: Foundations piece is a blog post (matches the existing blog collection), written from scratch in our own words, inspired by ach.net.au's foundations article but copying none of its text or its build-specific numbers.
- 2026-10-02: STH-specific facts not already on the site are marked [CONFIRM] rather than guessed.

## Waiting on Mitch
- Foundations guide: photos, then OK to merge to main.
- DNS cutover checklist items.

## Cutover pre-flight check, 2026-10-03 (read-only, run from Claudio)
- **BLOCKER (checklist items 1/2): 25 of the 59 URLs in the live Squarespace sitemap return 404 on sth-website.pages.dev** and are not in `public/_redirects` (39 rules, last touched 2026-07-06). All 25 still return 200 on the old site: /1-bedroom, /2-bedroom, /brisbane-tiny-homes, /cabin, /custom-sauna, /ensuite, /entertainment, /gold-coast-tiny-homes, /home, /office, /our-modular-homes, /pod-homes/overview-1, /portfolio-2 (+ 6 project pages), /queensland-tiny-houses, /retreat, /sunshine-coast-tiny-homes, /thank-you-pricing-guide, /thow-vs-class-1a-modular, /tiny-house-trailers. The other 34 resolve in one 301/308 hop to a 200 (no chains).
- OK: pages.dev is noindex (meta + header) with canonicals on the real domain; robots.txt and sitemap-index (39 URLs) present; brochure URL 200 with an active cert on `files.`.
- DNS today: nameservers ns1-3.nameserver.net.au (not Cloudflare); apex A + www CNAME point at Squarespace; MX = Microsoft 365; SPF, DKIM selector1/2, DMARC (p=quarantine) and autodiscover present; `files` CNAME → sth-website.pages.dev. Apex A TTL is 14400 s (4 h), not yet lowered.
- NOT done: apex and www are not yet added as custom domains on the Pages project (only `files.` is), so no certificate exists for them yet (item 9).
- Still Mitch's: GSC export, URL table sign-off, TTL lowering, rollback values, post-cutover mail + HubSpot form test, directory listings.
