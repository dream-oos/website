// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { load } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom Vite plugin: transform *.yaml imports to JS modules
// Works correctly during both dev and Astro prerender/build phases
function yamlPlugin() {
  return {
    name: 'vite-yaml',
    transform(src, id) {
      if (id.endsWith('.yaml') || id.endsWith('.yml')) {
        const parsed = load(src);
        return {
          code: `export default ${JSON.stringify(parsed)}`,
          map: null,
        };
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  // 静态输出 — 构建产物可直接部署到 Cloudflare Pages
  output: 'static',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss(), yamlPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});