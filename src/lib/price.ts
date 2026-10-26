// Brochure prices are whole dollars incl. GST, ex factory.
export const formatPrice = (n: number) => `$${n.toLocaleString('en-AU')}`;

export const EX_FACTORY_NOTE =
  'All prices are ex factory and do not include freight, delivery, installation, council approvals or any site works, as these are site specific.';

// Month the published prices were last checked against the brochure / live pages.
// Shown on /prices/ and in /llms.txt so a reader (or an AI answer) knows how current they are. Update with any price change.
export const PRICES_AS_AT = 'October 2026';
