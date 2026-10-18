# PLAN.md: STH-Website

## Goal
Replace the Squarespace sunshinetinyhouses.com.au with this Astro + Decap CMS site on Cloudflare Pages, then grow organic traffic with useful, STH-specific guides.

## Next steps
- DNS cutover (items in the global projects list; all with Mitch).
- Foundations guide (`src/content/blog/how-foundations-work-for-modular-homes.md`, branch `blog-foundations-guide`): text final per Mitch 2026-10-02, linked from FAQ + delivery page. Next: add 2–4 photos (piles/piers, crane set-down, subfloor) + real hero image, then merge to main (needs Mitch's OK).
- Gallery page still "Photos Coming Soon".
- Site content upgrade (branch `site-content-upgrade` 1328be6, worktree `~/repos/STH-Website-content`, pushed 2026-10-07, NOT merged; preview site-content-upgrade.sth-website.pages.dev): modular prices, sizes, floor plans, renders and inclusions from the Oct 2026 brochure; priced range + how-it-works on the homepage. Still to do after Mitch's review: reviews on homepage, "What it costs" page (needs real site-cost ranges), compare table.

## Assumptions
- 2026-10-02: Foundations post covers modular homes only (Mitch); FAQ + delivery page wording aligned to "screw piles or concrete bored piers".
- 2026-10-02: Foundations piece is a blog post (matches the existing blog collection), written from scratch in our own words, inspired by ach.net.au's foundations article but copying none of its text or its build-specific numbers.
- 2026-10-02: STH-specific facts not already on the site are marked [CONFIRM] rather than guessed.

- 2026-10-07: Mitch OK'd publishing from-prices on the site. Source of truth is the Oct 2026 brochure (`public/downloads/sth-brochure.pdf`); the ex-factory disclaimer sits beside every price.
- 2026-10-07: Fingal and Sunrise Beach House added as new model pages and Rio re-published, because all three are in the Oct 2026 brochure. Jacaranda changed to 2 bathrooms + separate laundry to match it. Office page copy now follows the brochure's Office (19.2 m²), replacing the older "Banksia Office" wording.
- 2026-10-07: model photos and floor plans were extracted from the web-optimised brochure PDF (photos about 600 to 800 px wide); replace with full-size originals when Mitch supplies them.
- 2026-10-07: tiny house on wheels turn-key prices set from the live Squarespace pages (Nat's increase): 1770 $115,000, Little Cove $125,000, Bondi $145,000, Granite Bay $140,000, Castaways $145,000, Boiling Pot $180,000, Lennox $145,000 (our page said $155,000; live wins). Lock-up prices unchanged on live. On `site-content-upgrade` e707e93.

## Waiting on Mitch
- AutoDraft catalogue (`sth-enquiry-autodraft/prompts/reply_system.md`) still has the old tiny house turn-key prices (e.g. 1770 $109,000, Boiling Pot $170,000, Lennox $140,000): OK to update it to the new ones?
- Site content upgrade review (preview link above), then OK to merge. Questions: Pandanus 51.3 m² looks like it includes the 12 m² deck (plan shows 10.5 × 3.8 m enclosed) though the deck is listed as an upgrade; pages still claim a "7-star energy rating" while the brochure says "energy assessment required"; FAQ says lock-up tiny houses from $45,000–$50,000 and turn-key from $85,000–$95,000 but the 1770 page says $59,500 / $109,000; full-size renders and floor plans; 3–5 real reviews + Google rating; site-cost ranges for a "What it costs" page.
- _Cleanup 2026-10-18: removed 3 (stale: trailer prices, the trailers page is now hidden and trailers live on tinytrailers.com.au; duplicates of STH-Website-launch PLAN.md: foundations photos, DNS cutover). Ranked list: ~/repos/claude-monitor/waiting/queue.md_

## Cutover pre-flight check, 2026-10-03 (read-only, run from Claudio)
- **BLOCKER (checklist items 1/2): 25 of the 59 URLs in the live Squarespace sitemap return 404 on sth-website.pages.dev** and are not in `public/_redirects` (39 rules, last touched 2026-07-06). All 25 still return 200 on the old site: /1-bedroom, /2-bedroom, /brisbane-tiny-homes, /cabin, /custom-sauna, /ensuite, /entertainment, /gold-coast-tiny-homes, /home, /office, /our-modular-homes, /pod-homes/overview-1, /portfolio-2 (+ 6 project pages), /queensland-tiny-houses, /retreat, /sunshine-coast-tiny-homes, /thank-you-pricing-guide, /thow-vs-class-1a-modular, /tiny-house-trailers. The other 34 resolve in one 301/308 hop to a 200 (no chains).
- OK: pages.dev is noindex (meta + header) with canonicals on the real domain; robots.txt and sitemap-index (39 URLs) present; brochure URL 200 with an active cert on `files.`.
- DNS today: nameservers ns1-3.nameserver.net.au (not Cloudflare); apex A + www CNAME point at Squarespace; MX = Microsoft 365; SPF, DKIM selector1/2, DMARC (p=quarantine) and autodiscover present; `files` CNAME → sth-website.pages.dev. Apex A TTL is 14400 s (4 h), not yet lowered.
- NOT done: apex and www are not yet added as custom domains on the Pages project (only `files.` is), so no certificate exists for them yet (item 9).
- Still Mitch's: GSC export, URL table sign-off, TTL lowering, rollback values, post-cutover mail + HubSpot form test, directory listings.

## Redirect gaps — branch `redirect-gaps` (17289bd, pushed 2026-10-03, NOT merged; worktree at ~/repos/STH-Website-redirects)
The 25 unmapped old URLs are now in `functions/_middleware.js` (the active map) and `public/_redirects` (kept in sync). Tested against the middleware: all 59 old sitemap URLs resolve in one 301 to a page that exists, with and without a trailing slash, no chains. Mitch to sign off this table (checklist item 7):

| Old URL | New URL | Confidence |
|---|---|---|
| /home | / | exact |
| /our-modular-homes, /pod-homes/overview-1 | /modular-homes/ | good |
| /1-bedroom, /2-bedroom, /cabin, /ensuite, /office, /retreat | /modular-homes/<same>/ | exact |
| /custom-sauna | /backyard-studios/saunas/ | good |
| /tiny-house-trailers | /tiny-houses-on-wheels/trailers/ | good |
| /portfolio-2 + its 6 project pages | /gallery/ | good (they look like leftover template pages) |
| /entertainment | /backyard-studios/ | **Mitch to check**: no entertainment page on the new site |
| /thow-vs-class-1a-modular | /council-regulations/ | **Mitch to check**: a full article with no equivalent; better ported as a page or blog post |
| /sunshine-coast-tiny-homes, /brisbane-tiny-homes, /gold-coast-tiny-homes, /queensland-tiny-houses | / | **Mitch to check**: location landing pages with no equivalent; if Search Console shows traffic, rebuild them instead |
| /thank-you-pricing-guide | / | stop-gap |

**Table signed off by Mitch 2026-10-03** ("sign off"), except `/thank-you-pricing-guide`, which is now a real page (below) and no longer redirected.

**Thank-you pages + lead tracking (74fe82c on `redirect-gaps`, pushed, NOT merged; Mitch OK'd the build 2026-10-03).** The new ad landing pages redirected to a `/thank-you` that did not exist, sent the old HubSpot field names (`phone_number_text`, `ideal_home`) and fired no Google Ads conversion. Now ported from the live gists (repo `sth-tracking-fix`):
- `src/pages/thank-you.astro` (flag-based Meta Lead + Google Ads conversion, same block as live) and `src/pages/thank-you-pricing-guide.astro` (wording copied from the live page), both noindex and out of the sitemap.
- `src/components/LeadTracking.astro` (attribution in pageUri, `sth_conv` flag, redirects) used by both landing pages; forms send `phone` + `message`; budget options match live; `project_details` rides in `message`.
- HubSpot tracking code added to both layouts (it is live on Squarespace site-wide).
- Verified with the `sth-tracking-fix` harness against a local build served with the middleware (`SITE=http://127.0.0.1:8790 LIVE_GISTS=1 REQUIRED_BUDGET=1 node test/harness.js meta google edge`): ALL PASSED. Budget stays a required field on the new site, so the blank-budget case is skipped.
- Not done: the contact page keeps its own redesigned form (no stored-UTM pageUri); page copy on the landing pages was not re-synced with the gists, only the form logic. The pricing-guide page still says "from $110k / $140k / $195k" as the live page does: check against the October 2026 brochure.
- Still needed after cutover (checklist item 10): one real test enquiry on the production domain with Meta Test Events and Google Tag Assistant open.
