import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import Footer from '../src/components/Footer.astro';
import { site } from '../src/config/site';

describe('Footer', () => {
  it('渲染稳定的底栏布局、社交链接和版权信息', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(Footer);

    expect(html).toContain('site-footer__inner');
    expect(html).toContain('site-footer__meta');
    expect(html).toContain(site.name);
    expect(html).toContain(site.email);
    for (const link of site.socials) {
      expect(html).toContain(link.label);
      expect(html).toContain(link.href);
    }
  });
});
