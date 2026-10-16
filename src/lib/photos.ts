// Numbered photo spots (see PHOTOS.md).
//
// Every place the site shows a photo is a numbered "spot" in src/data/photo-spots.ts.
// A spot shows public/photos/<n>.webp (or .jpg) once that file exists, otherwise the
// photo it has today ("current"), otherwise a plain placeholder.
// One spot can appear on several pages (a model's main photo is on its page, its
// listing card and the home page): replacing the file updates all of them.
//
// Preview builds (any branch except main) label every spot with its number so Nat
// can match photos to spots; production builds never show the labels.
import fs from 'node:fs';
import path from 'node:path';
import { SPOTS, type Spot } from '../data/photo-spots';

const PUBLIC = path.resolve('public');
const byKey = new Map<string, Spot>(SPOTS.map((s) => [s.key, s]));
const byCurrent = new Map<string, Spot>();
for (const s of SPOTS) if (s.current && !byCurrent.has(s.current)) byCurrent.set(s.current, s);

export const SHOW_SPOT_NUMBERS = import.meta.env.CF_PAGES_BRANCH !== 'main';

function replacement(n: number): string | undefined {
  for (const ext of ['webp', 'jpg', 'jpeg', 'png']) {
    const rel = `/photos/${String(n).padStart(3, '0')}.${ext}`;
    if (fs.existsSync(path.join(PUBLIC, rel))) return rel;
  }
  return undefined;
}

export interface Resolved { src?: string; n?: number; replaced: boolean }

function resolveSpot(spot: Spot | undefined, fallback?: string): Resolved {
  if (!spot) return { src: fallback, replaced: false };
  const r = replacement(spot.n);
  return { src: r ?? spot.current ?? fallback, n: spot.n, replaced: !!r };
}

/** Look a spot up by its key, e.g. 'home/hero-thow'. */
export function spot(key: string, fallback?: string): Resolved {
  const s = byKey.get(key);
  if (!s && import.meta.env.DEV) console.warn(`[photos] unknown spot key ${key}`);
  return resolveSpot(s, fallback);
}

/** Look a spot up by key; if the key isn't in the list, by the photo it shows today
 *  (first within the same product, e.g. key 'modular/ensuite/gallery-1' → 'modular/ensuite/...'). */
export function photo(currentSrc?: string, key?: string): Resolved {
  if (key && byKey.has(key)) return resolveSpot(byKey.get(key), currentSrc);
  if (!currentSrc) return { replaced: false };
  if (key) {
    const owner = key.split('/').slice(0, 2).join('/') + '/';
    const s = SPOTS.find((x) => x.key.startsWith(owner) && x.current === currentSrc);
    if (s) return resolveSpot(s, currentSrc);
  }
  return resolveSpot(byCurrent.get(currentSrc), currentSrc);
}

/** All spots whose key starts with a prefix, in number order (e.g. 'thow/lennox/g'). */
export function spotsWithPrefix(prefix: string): (Resolved & { key: string })[] {
  return SPOTS.filter((x) => x.key.startsWith(prefix)).sort((a, b) => a.n - b.n).map((x) => ({ key: x.key, ...resolveSpot(x) }));
}
