import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { site } from './src/config/site';

export default defineConfig({
  site: site.url,
  integrations: [sitemap()],
  markdown: {
    processor: satteri(),
    shikiConfig: { theme: 'rose-pine', wrap: true },
  },
});
