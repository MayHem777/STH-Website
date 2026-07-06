// Cloudflare Pages Function middleware.
//
// IMPORTANT: because this middleware matches every route, Cloudflare Pages
// DISABLES public/_redirects entirely ("Functions take precedence over
// _redirects"). All redirects must therefore live in REDIRECTS below.
// public/_redirects is kept in sync as documentation/fallback only —
// if you change one, change both.
//
// Responsibilities, in order:
//   1. 301 redirects for legacy Squarespace URLs
//   2. Security headers on every response
//   3. Force noindex on every host except the production domain
//      (the same static build is served from the production custom domain
//      AND the bare *.pages.dev subdomain, so only a per-request Host
//      header check can tell them apart)

const PRODUCTION_HOST = 'www.sunshinetinyhouses.com.au';

// Legacy Squarespace URL → new site path (all 301)
const REDIRECTS = {
  '/home-1-1': '/',
  '/our-tiny-houses': '/tiny-houses-on-wheels/',
  '/contact': '/contact/',
  '/gallery': '/gallery/',
  '/faqs': '/faq/',
  '/finance': '/finance/',
  '/delivery': '/delivery/',
  '/offgrid': '/off-grid/',
  '/council-regulations': '/council-regulations/',
  '/about': '/about/',
  '/things-to-know': '/faq/',
  '/modulars': '/modular-homes/',
  '/1770': '/tiny-houses-on-wheels/1770/',
  '/little-cove': '/tiny-houses-on-wheels/little-cove/',
  '/granite-bay': '/tiny-houses-on-wheels/granite-bay/',
  '/boiling-pot': '/tiny-houses-on-wheels/boiling-pot/',
  '/bondi': '/tiny-houses-on-wheels/bondi/',
  '/castaways': '/tiny-houses-on-wheels/castaways/',
  '/lennox': '/tiny-houses-on-wheels/lennox/',
  '/custom-design-build': '/tiny-houses-on-wheels/custom-design-build/',
  '/trailers': '/tiny-houses-on-wheels/trailers/',
  '/tiny-houses-on-wheels': '/tiny-houses-on-wheels/',
  '/blog/the-rise-of-modern-modular-why-a-granny-flat-is-the-ultimate-property-upgrade': '/blog/the-rise-of-modern-modular/',
  '/blog/noosa-council-abolishes-7000-infrastructure-charge-for-secondary-dwellingsheres-what-that-means-for-you': '/blog/noosa-council-abolishes-infrastructure-charge/',
  '/blog/benefits-pod-tiny-homes-sunshine-coast': '/blog/',
  '/blog/tiny-home-living-sunshine-coast': '/blog/',
  '/blog/boiling-pot-model-cozy-fun-living': '/blog/',
  '/blog/build-your-dream-tiny-home-on-the-sunshine-coast': '/blog/',
  '/blog/a-deep-dive-into-the-tiny-home-1770-model': '/blog/',
  '/blog/benefits-of-tiny-homes-for-remote-rural-living': '/blog/',
  '/blog/customizing-your-dream-tiny-home': '/blog/',
  '/blog/tiny-living-maximizing-small-spaces': '/blog/',
  '/blog/tiny-vs-traditional-homes-a-comparative-analysis': '/blog/',
  '/blog/the-financial-benefits-of-downsizing-to-a-tiny-house': '/blog/',
  '/blog/2023-tiny-home-design-trends': '/blog/',
  '/blog/tinyhousedreamhome': '/blog/',
  '/blog/choosingtinyhomeliving': '/blog/',
  '/blog/embracingfreedomtinyhouses': '/blog/',
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // 1. Legacy redirects (exact match, then /modulars/* splat).
  // Guard: `path` has trailing slashes stripped, so a rule like
  // '/contact' → '/contact/' would also match a request for '/contact/'
  // and redirect it to itself in an infinite loop. Never redirect when
  // the request already IS the target.
  const target = REDIRECTS[path];
  if (target && target !== url.pathname) {
    return Response.redirect(new URL(target, url.origin).href, 301);
  }
  if (path.startsWith('/modulars/')) {
    const splat = path.slice('/modulars/'.length);
    return Response.redirect(new URL(`/modular-homes/${splat}/`, url.origin).href, 301);
  }

  const response = await context.next();
  const host = context.request.headers.get('host') || '';
  const headers = new Headers(response.headers);

  // 2. Security headers (all hosts)
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), payment=()');
  if (host === PRODUCTION_HOST) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // 3. Production host: done. Everything else: force noindex.
  if (host === PRODUCTION_HOST) {
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  headers.set('X-Robots-Tag', 'noindex, nofollow');

  const contentType = headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  return new HTMLRewriter()
    .on('meta[name="robots"]', {
      element(el) {
        el.setAttribute('content', 'noindex, nofollow');
      },
    })
    .transform(new Response(response.body, { status: response.status, statusText: response.statusText, headers }));
}
