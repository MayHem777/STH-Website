// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.sunshinetinyhouses.com.au',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
  ],
  adapter: cloudflare(),
});