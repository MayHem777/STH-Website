# PLAN.md: STH-Website

## Goal
Replace the Squarespace sunshinetinyhouses.com.au with this Astro + Decap CMS site on Cloudflare Pages, then grow organic traffic with useful, STH-specific guides.

## Next steps
- **Ad landing pages (2026-10-17):** /google-ads-offer and /meta-ads-offer are now the live gists' pages, copied into `src/landing/google.html` and `meta.html` (photos local, thank-you links same-site). Until the DNS cutover the GIST is still what's live: any change to a gist must be copied into `src/landing/` too (and after cutover, edit only `src/landing/`).
- **Branch `launch-prep` (2026-10-17) = everything ready for launch in one place**: merged about-page, site-content-upgrade, redirect-gaps and blog-foundations-guide, plus: two-door home page (from the Squarespace home), numbered photo spots (PHOTOS.md, /photo-spots/, red labels on preview builds only), contact form attribution, audit fixes. Preview: launch-prep.sth-website.pages.dev. Mitch merges it into main via GitHub when happy (the box can't push to main).
- Nat fills a folder of numbered photos → `node scripts/import-photos.mjs "<folder>"` → build → check preview → commit to launch-prep.
- DNS cutover (items in the global projects list; all with Mitch).
- Foundations guide (`src/content/blog/how-foundations-work-for-modular-homes.md`, branch `blog-foundations-guide`): text final per Mitch 2026-10-02, linked from FAQ + delivery page. Next: add 2–4 photos (piles/piers, crane set-down, subfloor) + real hero image, then merge to main (needs Mitch's OK).
- Gallery page still "Photos Coming Soon".

## Assumptions
- 2026-10-17: new designs use 'comingSoon' (preview only; production build verified clean). Client names stay in frontmatter comments only, never on pages.
- 2026-10-17: 1770 main photo = the 1770 render from the old 1770 page until Nat's Drive photo arrives.
- 2026-10-17: model galleries pre-filled with the old Squarespace page photos (public/images/old/<model>/, 261 photos, floor plans and duplicates skipped). Spots renumbered once (373 total) before Nat started; numbers permanent from here.
- 2026-10-17 (Mitch): hours Mon–Fri 7am–4pm, Saturday by appointment; every direct email address on the site is hello@.
- 2026-10-17: photo spots keep today's photo until Nat supplies one; empty spots (THOW galleries, gallery page) stay hidden on production until filled. Spot numbers are permanent once Nat has the list.
- 2026-10-17: merge conflicts in modular model files resolved to the October brochure versions (site-content-upgrade).
- 2026-10-17: contact form budget options cut to the same 8 as the landing pages (HubSpot drops values it doesn't know).
- 2026-10-17: FAQ tiny house prices changed to match the model pages ($59,500 lock-up / $115,000 turn-key, 1770). Approved by Mitch 2026-10-18.
- 2026-10-18 (Mitch): studios / modular range "from $100k" everywhere; Pandanus shown as 10.5 × 3.8 m, 39.9 m² enclosed, deck 3.0 × 3.8 m as an upgrade; no star ratings on model pages, "Energy assessment required for your site" instead. The live ad page gists still say $110k until cutover (gist push needs Mitch's OK).
- 2026-10-02: Foundations post covers modular homes only (Mitch); FAQ + delivery page wording aligned to "screw piles or concrete bored piers".
- 2026-10-02: Foundations piece is a blog post (matches the existing blog collection), written from scratch in our own words, inspired by ach.net.au's foundations article but copying none of its text or its build-specific numbers.
- 2026-10-02: STH-specific facts not already on the site are marked [CONFIRM] rather than guessed.

## Waiting on Mitch
- Nat's report 2026-10-17: names + details (size, layout, beds/baths, inclusions, lock-up/turn-key prices, floor plan, photos) for 4 new tiny houses (pages new-tiny-house-a..d), Jarrod's and Jenny's 1-bed designs (new-1-bedroom-a/b), Daintree 1-bed (price, plan), Office B (Shane & Linda) and Office C (Daniel). All are comingSoon = preview only.
- Castaways + Boiling Pot: realistic 3D renders needed (who renders? Kiara / the renders designer?). Not something to fake.
- Look at the preview, then OK the merge of launch-prep to main (Mitch said yes to merging after a look, 2026-10-18).
- Foundations guide: photos, then OK to merge to main.
- DNS cutover checklist items.
