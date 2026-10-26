// Product structured data for every model page, in one place (AI search pass 2026-10-27).
// Google and AI answer engines (ChatGPT search, Perplexity, Gemini, Copilot) read this to
// answer "how much is X / how big is X" without guessing from page text. Facts come only
// from the content file (priceFrom, specs, area, size, bedrooms): nothing new is stated here.
export const SITE_URL = 'https://www.sunshinetinyhouses.com.au';
export const BUSINESS_ID = `${SITE_URL}/#business`;

type ProductData = {
  title: string;
  description: string;
  priceFrom?: number;
  area?: string;
  size?: string;
  bedrooms?: number;
  specs?: Record<string, string>;
};

// "$145,000 incl. GST" → 145000
const dollars = (s?: string) => {
  const m = s?.match(/\$([\d,]+)/);
  return m ? Number(m[1].replace(/,/g, '')) : undefined;
};

// Spec rows that are prices become offers, not properties
const PRICE_SPEC = /from$/i;

export function productSchema(data: ProductData, url: string, category: string) {
  const offer = (price: number, name?: string) => ({
    '@type': 'Offer',
    ...(name && { name }),
    url,
    price,
    priceCurrency: 'AUD',
    // Brochure prices are incl. GST, ex factory
    priceSpecification: { '@type': 'PriceSpecification', price, priceCurrency: 'AUD', valueAddedTaxIncluded: true },
    availability: 'https://schema.org/MadeToOrder',
    areaServed: { '@type': 'Country', name: 'Australia' },
    seller: { '@id': BUSINESS_ID },
  });

  const offers: object[] = [];
  if (data.priceFrom) offers.push(offer(data.priceFrom));
  // Tiny houses on wheels: lock-up and turn-key prices live in specs
  const lockUp = dollars(data.specs?.['Lock-Up from']);
  const turnKey = dollars(data.specs?.['Turn Key from']);
  if (lockUp) offers.push(offer(lockUp, 'Lock-up'));
  if (turnKey) offers.push(offer(turnKey, 'Turn-key'));

  const props: Record<string, string> = {};
  if (data.area) props['Floor area'] = data.area;
  if (data.size) props['Size'] = data.size;
  if (data.bedrooms) props['Bedrooms'] = String(data.bedrooms);
  for (const [k, v] of Object.entries(data.specs ?? {})) {
    if (!PRICE_SPEC.test(k) && !(k in props)) props[k] = v;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.title,
    description: data.description,
    category,
    url,
    brand: { '@type': 'Brand', name: 'Sunshine Tiny Houses' },
    manufacturer: { '@id': BUSINESS_ID },
    ...(Object.keys(props).length && {
      additionalProperty: Object.entries(props).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
    }),
    // One offer → plain Offer; several (lock-up + turn-key) → each listed; none → no offers (Google flags a priceless Offer)
    ...(offers.length === 1 && { offers: offers[0] }),
    ...(offers.length > 1 && { offers }),
  };
}
