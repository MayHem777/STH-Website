#!/usr/bin/env node
// Import Nat's numbered photos into the site.
//   node scripts/import-photos.mjs "/path/to/folder" [--dry-run]
// File names must start with the spot number: 1.jpg, 001.jpg, "012 kitchen.jpeg" all mean spot 12.
// Each photo is turned the right way up, resized for its spot and saved as public/photos/NNN.webp.
// Nothing is deleted. Run `npm run build` afterwards and check the preview.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SPOTS = JSON.parse(fs.readFileSync(new URL('../src/data/photo-spots.json', import.meta.url)));
const byN = new Map(SPOTS.map((s) => [s.n, s]));
const MAX_W = { wide: 2200, landscape: 1600, square: 1200, portrait: 1200 };
const MIN_W = { wide: 1600, landscape: 1000, square: 800, portrait: 700 };

const [dir, ...flags] = process.argv.slice(2);
const dry = flags.includes('--dry-run');
if (!dir || !fs.existsSync(dir)) { console.error('Usage: node scripts/import-photos.mjs <folder> [--dry-run]'); process.exit(1); }
const out = new URL('../public/photos/', import.meta.url);
fs.mkdirSync(out, { recursive: true });

const files = fs.readdirSync(dir).filter((f) => !f.startsWith('.'));
const seen = new Map(), problems = [], done = [];
for (const f of files.sort()) {
  const m = f.match(/^0*(\d+)/);
  if (!m) { problems.push(`${f}: name doesn't start with a spot number, skipped`); continue; }
  const n = Number(m[1]);
  const spot = byN.get(n);
  if (!spot) { problems.push(`${f}: there is no spot ${n}, skipped`); continue; }
  if (seen.has(n)) { problems.push(`${f}: spot ${n} already has ${seen.get(n)}, skipped`); continue; }
  if (/\.(heic|heif)$/i.test(f)) { problems.push(`${f}: iPhone HEIC photo, please export it as JPG, skipped`); continue; }
  seen.set(n, f);
  try {
    const img = sharp(path.join(dir, f)).rotate();
    const meta = await img.metadata();
    const w = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
    if (w < MIN_W[spot.shape]) problems.push(`${f}: only ${w} px wide, may look soft (spot ${n} wants ${MIN_W[spot.shape]}+)`);
    const target = new URL(`${String(n).padStart(3, '0')}.webp`, out);
    if (!dry) await img.resize({ width: MAX_W[spot.shape], withoutEnlargement: true }).webp({ quality: 80 }).toFile(target.pathname);
    done.push(`${String(n).padStart(3, '0')}  ${f}  →  ${spot.where}`);
  } catch (e) { problems.push(`${f}: could not read it (${e.message})`); }
}
const missing = SPOTS.filter((s) => !seen.has(s.n) && !fs.existsSync(new URL(`${String(s.n).padStart(3, '0')}.webp`, out)));
console.log(`${dry ? 'Would import' : 'Imported'} ${done.length} photo(s):`); done.forEach((l) => console.log('  ' + l));
if (problems.length) { console.log(`\n${problems.length} problem(s):`); problems.forEach((l) => console.log('  ' + l)); }
console.log(`\n${missing.length} spot(s) still showing today's photo or a placeholder.`);
