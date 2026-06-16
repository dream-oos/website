import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { readFile } from 'node:fs/promises';
import { describe, it, expect } from 'vitest';
import PostLayout from '../src/layouts/PostLayout.astro';

describe('PostLayout', () => {
  it('文章详情页在桌面端使用更宽的阅读容器', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(PostLayout, {
      props: {
        title: '长文',
        date: new Date('2026-06-12'),
      },
    });
    const baseCss = await readFile(new URL('../src/styles/base.css', import.meta.url), 'utf8');

    const article = html.match(/<article[^>]*class="container container--reading post-page"[^>]*>/);

    expect(article?.[0]).toBeDefined();
    expect(baseCss).toMatch(/\.container--reading\s*\{\s*max-width:\s*980px;\s*\}/);
  });

  it('正文容器默认可见，同时保留页头动效钩子', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(PostLayout, {
      props: {
        title: '长文',
        date: new Date('2026-06-12'),
        description: '用于回归测试',
      },
    });

    const bodyShell = html.match(/<div[^>]*class="post-body surface-shell"[^>]*>/);
    const hero = html.match(/<header[^>]*class="post-hero"[^>]*>/);

    expect(bodyShell?.[0]).toBeDefined();
    expect(bodyShell?.[0]).not.toContain('data-reveal');
    expect(hero?.[0]).toContain('data-reveal');
  });
});
