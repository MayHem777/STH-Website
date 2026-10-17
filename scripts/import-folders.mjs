#!/usr/bin/env node
// Easy photo import for Nat: one folder per model/page, NO renaming.
//   node scripts/import-folders.mjs "/path/to/STH Website Photos" [--dry-run]
// Folder names (any case/spacing): a model name (Bunya, Straddie 1 Bed, Boiling Pot …),
// "Home Modular", "Home Tiny House", client design names for the new models ("Anita & Rowan", "Krista", "Jarrod",
// "Derrill", "Shane & Linda", "Daniel" …), "About", "Backyard Offices", "Backyard Saunas",
// "Utility Rooms", "Gallery Modular", "Gallery Tiny Houses".
// In a model folder: the photo with "main" in its name is the main photo (else the first one);
// the rest, in name order, BECOME that page's gallery (replacing the placeholders).
// A folder with just one photo only changes the main photo and leaves the gallery alone.
// Afterwards run: node scripts/make-photo-spots.mjs && npm run build
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname;
const [dir, ...flags] = process.argv.slice(2);
const dry = flags.includes('--dry-run');
if (!dir || !fs.existsSync(dir)) { console.error('Usage: node scripts/import-folders.mjs <folder> [--dry-run]'); process.exit(1); }
const SPOTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/photo-spots.json'), 'utf8'));
const spotN = (key) => SPOTS.find((s) => s.key === key && !s.retired)?.n;
const norm = (s) => s.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();

const MODELS = {
  thow: { 'anita rowan': 'new-tiny-house-a', 'anita and rowan': 'new-tiny-house-a', 'michelle townsend': 'new-tiny-house-b', 'simone trevor': 'new-tiny-house-b', 'simone and trevor': 'new-tiny-house-b', 'luke downs': 'new-tiny-house-c', 'krista': 'new-tiny-house-d', '1770': '1770', 'little cove': 'little-cove', 'bondi': 'bondi', 'granite bay': 'granite-bay', 'castaways': 'castaways', 'boiling pot': 'boiling-pot', 'lennox': 'lennox', 'custom design build': 'custom-design-build', 'custom design and build': 'custom-design-build' },
  modular: { 'jarrod': 'new-1-bedroom-a', 'jarrods design': 'new-1-bedroom-a', 'jenny': 'new-1-bedroom-b', 'jennys design': 'new-1-bedroom-b', 'derrill': 'daintree-1-bedroom', 'daintree 1 bed': 'daintree-1-bedroom', 'daintree 1 bedroom': 'daintree-1-bedroom', 'cabin': 'cabin', 'ensuite': 'ensuite', 'fingal': 'fingal', 'bunya': 'bunya', 'rio': 'rio', 'pandanus': 'pandanus', 'daintree': 'daintree', 'jacaranda': 'jacaranda', 'sunrise beach house': 'sunrise-beach-house', 'sunrise': 'sunrise-beach-house', 'office': 'office', 'retreat': 'retreat',
    'straddie 1 bed': 'straddie-1-bedroom', 'straddie 1 bedroom': 'straddie-1-bedroom', 'straddie 1': 'straddie-1-bedroom', 'straddie 2 bed': 'straddie-2-bedroom', 'straddie 2 bedroom': 'straddie-2-bedroom', 'straddie 2': 'straddie-2-bedroom' },
};
const SINGLES = { 'home modular': 'home/door-modular', 'home modular homes': 'home/door-modular', 'home tiny house': 'home/door-thow', 'home tiny houses': 'home/door-thow', 'about': 'about/team', 'backyard offices': 'studio/offices/main', 'offices': 'studio/offices/main', 'backyard saunas': 'studio/saunas/main', 'saunas': 'studio/saunas/main', 'utility rooms': 'studio/utility-rooms/main', 'utility room': 'studio/utility-rooms/main' };
const GALLERIES = { 'gallery modular': 'gallery/modular-', 'gallery modular homes': 'gallery/modular-', 'gallery tiny houses': 'gallery/thow-', 'gallery tiny house': 'gallery/thow-', 'gallery thow': 'gallery/thow-' };

const IMG = /\.(jpe?g|png|webp|tiff?)$/i;
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
const photosIn = (d) => fs.readdirSync(d).filter((f) => IMG.test(f) && !f.startsWith('.')).sort(natural);
const report = [], problems = [];
const pad = (n) => String(n).padStart(3, '0');

async function save(src, dest, width) {
  if (dry) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(src).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest);
}
function setGallery(collDir, id, title, srcs) {
  const f = path.join(ROOT, 'src/content', collDir, id + '.md');
  let t = fs.readFileSync(f, 'utf8');
  const end = t.indexOf('\n---', 4); let fm = t.slice(0, end); const body = t.slice(end);
  fm = fm.replace(/\n# Photos copied from the old Squarespace page[^\n]*/, '').replace(/\ngallery:\n(?:  .*\n?)*/, '\n');
  const block = srcs.map((s, i) => `  - src: "${s}"\n    alt: "${title}, photo ${i + 1}"`).join('\n');
  fm = fm.replace(/\n+$/, '') + (srcs.length ? `\n# Photos chosen by Nat (${new Date().toISOString().slice(0, 10)})\ngallery:\n${block}` : '');
  if (!dry) fs.writeFileSync(f, fm + body);
}

for (const sub of fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const name = norm(sub.name), full = path.join(dir, sub.name), files = photosIn(full);
  if (!files.length) { problems.push(fs.readdirSync(full).some((f) => /\.(heic|heif)$/i.test(f)) ? `${sub.name}: only iPhone HEIC photos, please export them as JPG` : `${sub.name}: no photos found`); continue; }
  if (fs.readdirSync(full).some((f) => /\.(heic|heif)$/i.test(f))) problems.push(`${sub.name}: has iPhone HEIC photos, which were skipped; export them as JPG`);
  if (SINGLES[name]) {
    const n = spotN(SINGLES[name]); await save(path.join(full, files[0]), path.join(ROOT, 'public/photos', pad(n) + '.webp'), 1800);
    report.push(`${sub.name}: ${files[0]} → spot ${pad(n)}`); if (files.length > 1) problems.push(`${sub.name}: only one photo used (${files[0]}), ${files.length - 1} ignored`); continue;
  }
  if (GALLERIES[name]) {
    const keys = SPOTS.filter((s) => s.key.startsWith(GALLERIES[name]) && !s.retired).sort((a, b) => a.n - b.n);
    for (let i = 0; i < Math.min(files.length, keys.length); i++) await save(path.join(full, files[i]), path.join(ROOT, 'public/photos', pad(keys[i].n) + '.webp'), 1600);
    report.push(`${sub.name}: ${Math.min(files.length, keys.length)} photos → spots ${pad(keys[0].n)}…`); if (files.length > keys.length) problems.push(`${sub.name}: ${files.length - keys.length} extra photos ignored (${keys.length} spots)`); continue;
  }
  const OFFICE_MODELS = { 'shane linda': 1, 'shane and linda': 1, 'daniel': 2, 'daniels design': 2 };
  if (OFFICE_MODELS[name] !== undefined) {
    const idx = OFFICE_MODELS[name], rel = `/images/nat/office-models/${idx + 1}.webp`;
    await save(path.join(full, files.find((f) => /main/i.test(f)) ?? files[0]), path.join(ROOT, 'public', rel), 1600);
    const f = path.join(ROOT, 'src/content/products-modular/office.md'); let t = fs.readFileSync(f, 'utf8');
    const blocks = t.split(/\n  - name: /); // [before, model0, model1, model2]
    if (blocks[idx + 1] !== undefined) { blocks[idx + 1] = blocks[idx + 1].replace(/\n    image: "[^"]*"/, '') .replace(/\n    blurb: /, `\n    image: "${rel}"\n    blurb: `); if (!dry) fs.writeFileSync(f, blocks.join('\n  - name: ')); }
    report.push(`${sub.name}: office design ${idx + 1} photo → ${rel}`); continue;
  }
  const coll = MODELS.thow[name] ? 'thow' : MODELS.modular[name] ? 'modular' : null;
  if (!coll) { problems.push(`${sub.name}: folder name not recognised, skipped`); continue; }
  const id = MODELS[coll][name], collDir = coll === 'thow' ? 'products-thow' : 'products-modular';
  const title = (fs.readFileSync(path.join(ROOT, 'src/content', collDir, id + '.md'), 'utf8').match(/^title:\s*"?([^"\n]+)/m) || [])[1] || id;
  const mainFile = files.find((f) => /main/i.test(f)) ?? files[0];
  const rest = files.filter((f) => f !== mainFile);
  const mainN = spotN(`${coll}/${id}/main`);
  await save(path.join(full, mainFile), path.join(ROOT, 'public/photos', pad(mainN) + '.webp'), 1800);
  if (!rest.length) { report.push(`${sub.name}: main photo ${mainFile} → spot ${pad(mainN)} (gallery left as it is)`); continue; }
  const outDir = path.join(ROOT, 'public/images/nat', id);
  if (!dry && fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  const srcs = [];
  for (let i = 0; i < rest.length; i++) { const rel = `/images/nat/${id}/${String(i + 1).padStart(2, '0')}.webp`; await save(path.join(full, rest[i]), path.join(ROOT, 'public', rel), 1600); srcs.push(rel); }
  setGallery(collDir, id, title, srcs);
  report.push(`${sub.name}: main photo ${mainFile} → spot ${pad(mainN)}, gallery ${srcs.length} photos (replaces the placeholders)`);
}
console.log(`${dry ? 'DRY RUN — nothing changed\n' : ''}${report.join('\n')}`);
if (problems.length) console.log(`\nProblems:\n  ${problems.join('\n  ')}`);
console.log('\nNext: node scripts/make-photo-spots.mjs && npm run build, then check the preview.');
