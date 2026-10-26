// /llms.txt: a plain-text guide to the site for AI assistants (llmstxt.org format; AI search pass 2026-10-27).
// No major engine has promised to read it, but it costs nothing and gives any AI tool that
// fetches it our facts in one place. Built from the content files, so prices never drift.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { catalogue } from '../lib/catalogue';
import { EX_FACTORY_NOTE, PRICES_AS_AT } from '../lib/price';
import { FOUNDED_YEAR } from '../config/site';

const SITE = 'https://www.sunshinetinyhouses.com.au';
const u = (p: string) => `${SITE}${p}`;

export const GET: APIRoute = async () => {
  const { modular, thow, studios } = await catalogue();
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());

  const lines = [
    '# Sunshine Tiny Houses',
    '',
    `> Queensland licensed builder (QBCC licence 15205110, Master Builders Queensland member) in Noosaville on the Sunshine Coast, founded ${FOUNDED_YEAR}. We design and build Class 1a modular homes, granny flats, tiny houses on wheels and backyard studios in our own factory, and deliver Australia-wide. Run by Mitch Croft (builder, 20+ years on the Sunshine Coast) and Nat Croft (design).`,
    '',
    '- Factory and showroom: 24 Venture Drive, Noosaville QLD 4566 (visits by appointment)',
    '- Phone: (07) 5315 8365. Email: hello@sunshinetinyhouses.com.au',
    '- Office hours: Monday to Friday 7:30 am to 4 pm, Saturday by appointment',
    `- Prices below are current at ${PRICES_AS_AT} and include GST. ${EX_FACTORY_NOTE}`,
    '- Lock-up = watertight shell with windows, roof and cladding, bare frames inside. Turn-key = completely finished, ready to move in.',
    '',
    '## Main pages',
    '',
    `- [Price list](${u('/prices/')}): every model with price and size on one page`,
    `- [Modular homes and granny flats](${u('/modular-homes/')}): Class 1a homes built in the factory and craned onto your block`,
    `- [How a modular build works](${u('/modular-homes/our-process/')})`,
    `- [Tiny houses on wheels](${u('/tiny-houses-on-wheels/')}): homes on road-registrable trailers we build ourselves`,
    `- [Modular home or tiny house on wheels?](${u('/thow-vs-class-1a-modular/')})`,
    `- [Backyard studios](${u('/backyard-studios/')})`,
    `- [Council regulations](${u('/council-regulations/')})`,
    `- [Delivery](${u('/delivery/')}), [Off-grid options](${u('/off-grid/')}), [Finance](${u('/finance/')})`,
    `- [FAQ](${u('/faq/')}), [About us](${u('/about/')}), [Contact](${u('/contact/')})`,
    `- [Brochure (PDF)](${u('/downloads/sth-brochure.pdf')})`,
    '',
    '## Modular homes and granny flats',
    '',
    ...modular.map((m) => `- [${m.title}](${u(m.href)}): ${[m.rooms, m.area, m.size, m.price && `from ${m.price}`].filter(Boolean).join(', ')}. ${m.summary}`),
    '',
    '## Tiny houses on wheels',
    '',
    ...thow.map((t) => `- [${t.title}](${u(t.href)}): ${[t.length && `${t.length} long`, t.width && `${t.width} wide`, t.sleeps && `sleeps ${t.sleeps}`, t.lockUp && `lock-up from ${t.lockUp}`, t.turnKey && `turn-key from ${t.turnKey}`].filter(Boolean).join(', ')}. ${t.summary}`),
    `- [Custom design and build](${u('/tiny-houses-on-wheels/custom-design-build/')}): a tiny house designed from scratch`,
    '',
    '## Backyard studios',
    '',
    ...studios.map((s) => `- [${s.title}](${u(s.href)}): ${s.summary}`),
    '',
    '## Guides',
    '',
    ...posts.map((p) => `- [${p.data.title}](${u(`/blog/${p.id}/`)}): ${p.data.description}`),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
