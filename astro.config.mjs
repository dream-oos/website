// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import path from 'path';
import { fileURLToPath } from 'url';
import { load } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom Vite plugin: transform *.yaml imports to JS modules at build time
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
  // server 模式 + Cloudflare Workers 适配器
  // 各页面通过 export const prerender = true 声明静态预渲染
  output: 'server',

  // Cloudflare Workers 适配器
  adapter: cloudflare(),

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