// Where a modular model's page lives. Models in a range (the Cabin range: Banksia, Dahlia,
// Raglan) sit under the range's listing page; bedroom models under /N-bedroom/; the rest stand alone.
export function modularHref(id: string, data: { bedrooms?: number; range?: string }): string {
  if (data.range) return `/modular-homes/${data.range}/${id}/`;
  if (data.bedrooms) return `/modular-homes/${data.bedrooms}-bedroom/${id}/`;
  return `/modular-homes/${id}/`;
}

/** Ids of products that are range listing pages (some other product names them as its range). */
export function rangeIds(products: { data: { range?: string } }[]): Set<string> {
  return new Set(products.map((p) => p.data.range).filter((r): r is string => !!r));
}
