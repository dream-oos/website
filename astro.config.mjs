import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lin-shen.vercel.app',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'rose-pine-dawn', wrap: true },
  },
});
