import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Hero from '../src/components/Hero.astro';
import { site } from '../src/data/site';

describe('Hero', () => {
  it('渲染站点名字与一句话简介', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Hero);
    expect(html).toContain(site.name);
    expect(html).toContain(site.tagline);
  });
});
