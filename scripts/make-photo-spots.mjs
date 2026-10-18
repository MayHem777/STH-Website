#!/usr/bin/env node
// Builds/refreshes src/data/photo-spots.json from the site content.
// Existing spots keep their numbers forever; new spots are added at the end.
//   node scripts/make-photo-spots.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const FILE = path.join(ROOT, 'src/data/photo-spots.json');
const old = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];
const oldByKey = new Map(old.map((s) => [s.key, s]));

// Tiny frontmatter reader (enough for our flat YAML: strings, lists of {src, alt}, models[])
function fm(file) {
  const t = fs.readFileSync(file, 'utf8'); const m = t.match(/^---\n([\s\S]*?)\n---/); if (!m) return {};
  const y = m[1], get = (k) => (y.match(new RegExp(`^${k}:\\s*"?([^"\\n]*)"?`, 'm')) || [])[1];
  const list = (k) => { const b = y.match(new RegExp(`^${k}:\\n((?:  .*\\n?)*)`, 'm')); if (!b) return [];
    return b[1].split(/\n  - /).map((x) => ({ src: (x.match(/src:\s*"?([^"\n]+)"?/) || [])[1], name: (x.match(/name:\s*"?([^"\n]+)"?/) || [])[1], image: (x.match(/image:\s*"?([^"\n]+)"?/) || [])[1] })).filter((x) => x.src || x.image); };
  return { title: get('title'), draft: /^true\b/.test(get('draft') ?? ''), order: Number(get('order') || 99), hero: get('heroImage') || undefined, gallery: list('gallery'), models: list('models'), bedrooms: get('bedrooms') };
}
function items(dir) {
  const d = path.join(ROOT, 'src/content', dir); if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.md')).map((f) => ({ id: f.replace(/\.md$/, ''), ...fm(path.join(d, f)) })).filter((x) => !x.draft).sort((a, b) => a.order - b.order);
}

const spots = []; const seenCurrent = new Map();
function add(key, page, where, shows, shape, current) {
  // The same photo used twice for ONE product (main photo = first gallery photo) is one spot.
  // Different products or pages sharing a photo get separate spots, so each can be changed alone.
  const owner = key.split('/').slice(0, 2).join('/'), ck = `${owner}|${current}`;
  if (current && seenCurrent.has(ck)) return;
  const s = { key, page, where, shows, shape, ...(current ? { current } : {}), alsoOn: [] };
  spots.push(s); if (current) seenCurrent.set(ck, s);
}

add('home/door-thow', '/', 'Home, top: left panel "Tiny houses on wheels"', 'Best exterior of a finished tiny house on wheels on its trailer', 'landscape', '/images/thow-dark-on-site.webp');
add('home/door-modular', '/', 'Home, top: right panel "Modular homes & granny flats"', 'Best exterior of a finished modular home on site, ideally with a deck', 'landscape', '/images/models/rio-ext.webp');

for (const p of items('products-thow')) {
  const page = `/tiny-houses-on-wheels/${p.id}/`;
  add(`thow/${p.id}/main`, page, `${p.title}: main photo (also its card on the tiny houses page and home page)`, `Best exterior of a ${p.title} we built`, 'landscape', p.hero);
  p.gallery.forEach((g, i) => add(`thow/${p.id}/gallery-${i + 1}`, page, `${p.title}: photo gallery ${i + 1}`, `${p.title}, inside or out (today's photo is from the old website)`, 'landscape', g.src));
}
for (const p of items('products-modular')) {
  const page = p.bedrooms ? `/modular-homes/${p.bedrooms}-bedroom/${p.id}/` : `/modular-homes/${p.id}/`;
  add(`modular/${p.id}/main`, page, `${p.title}: main photo (also its card on the modular pages and home page)`, `Best exterior of a ${p.title} (real build if we have one)`, 'landscape', p.hero);
  p.models.forEach((m) => m.image && add(`modular/${p.id}/model-${(m.name || '').toLowerCase()}`, page, `${p.title} page: ${m.name} photo`, `${m.name} exterior`, 'landscape', m.image));
  p.gallery.forEach((g, i) => add(`modular/${p.id}/gallery-${i + 1}`, page, `${p.title}: photo gallery ${i + 1}`, /ext/.test(g.src) ? `${p.title} exterior` : `${p.title}, inside or out`, 'landscape', g.src));
}
for (const p of items('products-class10a')) {
  add(`studio/${p.id}/main`, `/backyard-studios/${p.id}/`, `${p.title}: main photo (also its card on the studios and home pages)`, `Best photo of a ${p.title.toLowerCase().replace(/s$/, '')} we built`, 'landscape', p.hero);
}
add('about/team', '/about/', 'About page, beside "Who we are"', 'Mitch and Nat or the team at work (current staff only)', 'square', '/images/about-workshop.webp');
// Ad landing pages (ported from the live gists 2026-10-17; photos copied into /images/lp/)
add('lp/google/badge-bg', '/google-ads-offer/', 'Google ads page: background behind the top section', 'Tall or wide exterior shot with space for text', 'wide', '/images/lp/lp-hero-google.webp');
['/images/lp/lp-build-1.webp', '/images/lp/lp-build-2.webp', '/images/lp/lp-build-3.webp'].forEach((src, i) => add(`lp/google/gallery-${i + 1}`, '/google-ads-offer/', `Google ads page: "Completed projects" photo ${i + 1}`, ['Finished secondary dwelling exterior', 'Finished secondary dwelling exterior', 'Interior finish and fit-out'][i], 'landscape', src));
add('lp/google/why', '/google-ads-offer/', 'Google ads page: photo beside "Why us"', 'Finished build, upright framing works best', 'portrait', '/images/lp/lp-build-4.webp');
add('lp/meta/hero-bg', '/meta-ads-offer/', 'Meta ads page: background behind the top section', 'Wide exterior shot with space for text', 'wide', '/images/lp/lp-build-1.webp');
['/images/lp/lp-hero-google.webp', '/images/lp/lp-build-2.webp', '/images/lp/lp-build-3.webp', '/images/lp/lp-build-4.webp'].forEach((src, i) => add(`lp/meta/gallery-${i + 1}`, '/meta-ads-offer/', `Meta ads page: gallery photo ${i + 1}`, 'Finished build, inside or out', 'landscape', src));
// Gallery: two sections, modular homes first (Mitch 2026-10-17). Same numbers as the old gallery/1..24 keys.
const RENAMED = {};
for (let i = 1; i <= 12; i++) { add(`gallery/modular-${i}`, '/gallery/', `Gallery, Class 1a modular homes: photo ${i}`, 'A finished modular home or granny flat, outside or in (crane lifts and installs welcome)', 'landscape'); RENAMED[`gallery/modular-${i}`] = `gallery/${i}`; }
for (let i = 1; i <= 12; i++) { add(`gallery/thow-${i}`, '/gallery/', `Gallery, tiny houses on wheels: photo ${i}`, 'A finished tiny house on wheels, outside or in (deliveries welcome)', 'landscape'); RENAMED[`gallery/thow-${i}`] = `gallery/${i + 12}`; }
for (const p of items('blog')) add(`blog/${p.id}/hero`, `/blog/${p.id}/`, `Blog: "${p.title}" top photo`, 'Photo that fits the article', 'wide', p.hero);
add('site/share', '/', 'Picture shown when someone shares the website on Facebook or in a text', 'One strong wide exterior shot', 'wide', '/og-default.jpg');

let next = Math.max(0, ...old.map((s) => s.n)) + 1;
const out = spots.map((s) => ({ n: oldByKey.get(s.key)?.n ?? oldByKey.get(RENAMED[s.key])?.n ?? next++, ...s, alsoOn: s.alsoOn.length ? s.alsoOn : undefined }));
for (const o of old) if (!out.find((s) => s.key === o.key) && !Object.values(RENAMED).includes(o.key)) out.push({ ...o, retired: true });
out.sort((a, b) => a.n - b.n);
fs.writeFileSync(FILE, JSON.stringify(out, null, 1) + '\n');
console.log(`${out.length} spots (${out.filter((s) => s.current).length} have a photo today, ${out.filter((s) => !s.current).length} empty)`);

// PHOTOS.md: the same list as /photo-spots/, readable on GitHub or printed
const SHAPE = { wide: 'Wide, landscape', landscape: 'Landscape', square: 'Square-ish', portrait: 'Portrait (upright)' };
const live = out.filter((s) => !s.retired);
const md = [
  '# Photo spots',
  '',
  'Every photo on the website has a number. Nat: make one folder of photos named after the numbers',
  '(`001.jpg`, `002.jpg` …; extra words are fine, e.g. `014 lennox kitchen.jpg`) and tell Mitch where it is.',
  'Any spot without a new photo keeps the photo it has today (or stays hidden if it has none).',
  '',
  'The preview site shows each number in a red label on its photo, and lists them all at `/photo-spots/`.',
  'To load the photos: `node scripts/import-photos.mjs "<folder>"`, then build and check the preview.',
  '',
  '| No. | Where | What it should show | Shape | Photo today |',
  '|---|---|---|---|---|',
  ...live.map((s) => `| ${String(s.n).padStart(3, '0')} | [${s.where}](${s.page}) | ${s.shows} | ${SHAPE[s.shape]} | ${s.current ? '`' + s.current + '`' : 'none (hidden until filled)'} |`),
  '',
];
fs.writeFileSync(path.join(ROOT, 'PHOTOS.md'), md.join('\n'));
