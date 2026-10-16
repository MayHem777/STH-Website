// Numbered photo spots: the list Nat works from (PHOTOS.md and /photo-spots/ are made from it).
// The data lives in photo-spots.json so scripts/import-photos.mjs can read it too.
// Numbers are permanent: never renumber a spot; add new spots at the end.
import data from './photo-spots.json';
export type Shape = 'wide' | 'landscape' | 'square' | 'portrait';
export interface Spot {
  n: number;          // Nat names the file after it: 001.jpg
  key: string;        // stable id the page code uses
  page: string;       // page where it shows (first one, if several)
  where: string;      // which spot on that page
  shows: string;      // what the photo should show
  shape: Shape;
  current?: string;   // the photo shown there today
  alsoOn?: string[];  // other pages showing the same photo
}
export const SPOTS = data as Spot[];
