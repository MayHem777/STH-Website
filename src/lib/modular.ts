// Where a modular model's page lives. Models in a range (Cabin: Banksia, Dahlia, Raglan;
// Office: A, B, C) sit under the range's listing page; bedroom models under /N-bedroom/; the rest stand alone.
export function modularHref(id: string, data: { bedrooms?: number; range?: string }): string {
  if (data.range) return `/modular-homes/${data.range}/${id}/`;
  if (data.bedrooms) return `/modular-homes/${data.bedrooms}-bedroom/${id}/`;
  return `/modular-homes/${id}/`;
}

/** Ids of products that are range listing pages (some other product names them as its range). */
export function rangeIds(products: { data: { range?: string } }[]): Set<string> {
  return new Set(products.map((p) => p.data.range).filter((r): r is string => !!r));
}

/** Ranges with their own listing page. badge: card badge for the range's models. */
export const RANGES: Record<string, { plural: string; modelTitle: string; seoTitle: string; badge?: string }> = {
  cabin: { plural: 'Cabins', modelTitle: 'Modular Cabin', seoTitle: 'Modular Cabins Queensland' },
  // Offices are utility rooms, not studios (Mitch 2026-10-17)
  office: { plural: 'Offices', modelTitle: 'Modular Backyard Office', seoTitle: 'Modular Offices Queensland', badge: 'Utility room' },
};
