// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.sunshinetinyhouses.com.au',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/google-ads-offer/') &&
        !page.includes('/meta-ads-offer/') &&
        !page.includes('/privacy-policy/') &&
        !page.includes('/contact/thank-you/') &&
        !page.includes('/thank-you/') &&
        !page.includes('/thank-you-pricing-guide/') &&
        !page.includes('/404/'),
    }),
  ],
});