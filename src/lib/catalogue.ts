// Every live model with its price and size, for the /prices/ page and /llms.txt
// (AI search pass 2026-10-27). Reads the same content files as the model pages, so the
// list can never disagree with them. Nothing here is a new fact.
import { getCollection } from 'astro:content';
import { listed } from './visible';

import { modularHref, rangeIds } from './modular';
import { roomsLine } from './rooms';
import { formatPrice } from './price';

// New designs waiting on names and prices stay out of the price list even on previews
const priced = (data: { draft?: boolean; comingSoon?: boolean }) => listed(data) && !data.comingSoon;

export type ModularRow = { title: string; href: string; rooms?: string; area?: string; size?: string; price?: string; priceNum?: number; summary: string };
export type ThowRow = { title: string; href: string; length?: string; width?: string; sleeps?: string; lockUp?: string; turnKey?: string; turnKeyNum?: number; summary: string };
export type StudioRow = { title: string; href: string; summary: string };

// "$145,000 incl. GST" → "$145,000"
const price = (s?: string) => s?.match(/\$[\d,]+/)?.[0];
const num = (s?: string) => (s ? Number(s.replace(/[$,]/g, '')) : undefined);

export async function catalogue() {
  const modularAll = await getCollection('products-modular', ({ data }) => priced(data));
  const ranges = rangeIds(modularAll); // Cabin and Office range pages: their models are listed instead
  const modular: ModularRow[] = modularAll
    .filter((p) => !ranges.has(p.id))
    .map((p) => ({
      title: p.data.title,
      href: modularHref(p.id, p.data),
      rooms: roomsLine(p.id, p.data.specs),
      area: p.data.area,
      size: p.data.size,
      price: p.data.priceFrom ? formatPrice(p.data.priceFrom) : undefined,
      priceNum: p.data.priceFrom,
      summary: p.data.description,
    }))
    .sort((a, b) => (a.priceNum ?? Infinity) - (b.priceNum ?? Infinity));

  const thow: ThowRow[] = (await getCollection('products-thow', ({ data }) => priced(data)))
    .filter((p) => p.data.specs?.['Turn Key from'] || p.data.specs?.['Lock-Up from'])
    .map((p) => {
      const s = p.data.specs ?? {};
      return {
        title: p.data.title,
        href: `/tiny-houses-on-wheels/${p.id}/`,
        length: s.Length,
        width: s.Width,
        sleeps: s.Sleeps,
        lockUp: price(s['Lock-Up from']),
        turnKey: price(s['Turn Key from']),
        turnKeyNum: num(price(s['Turn Key from'])),
        summary: p.data.description,
      };
    })
    .sort((a, b) => (a.turnKeyNum ?? Infinity) - (b.turnKeyNum ?? Infinity));

  const studios: StudioRow[] = (await getCollection('products-class10a', ({ data }) => priced(data)))
    .sort((a, b) => a.data.order - b.data.order)
    .map((p) => ({ title: p.data.title, href: `/backyard-studios/${p.id}/`, summary: p.data.description }));

  return { modular, thow, studios };
}
