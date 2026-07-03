// Cloudflare Pages Function: force noindex on every host except the
// production domain. This can't be decided at Astro build time — the same
// static build is served both from the production custom domain AND the
// bare *.pages.dev subdomain (Cloudflare Pages always mirrors the latest
// production deploy there), so only a per-request Host header check can
// tell them apart.
const PRODUCTION_HOST = 'www.sunshinetinyhouses.com.au';

export async function onRequest(context) {
  const response = await context.next();
  const host = context.request.headers.get('host') || '';

  if (host === PRODUCTION_HOST) {
    return response;
  }

  const headers = new Headers(response.headers);
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
