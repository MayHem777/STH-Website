// Brochure prices are whole dollars incl. GST, ex factory.
export const formatPrice = (n: number) => `$${n.toLocaleString('en-AU')}`;

export const EX_FACTORY_NOTE =
  'All prices are ex factory and do not include freight, delivery, installation, council approvals or any site works, as these are site specific.';
