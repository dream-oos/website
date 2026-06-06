import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import SocialLinks from '../src/components/SocialLinks.astro';

describe('SocialLinks', () => {
  it('渲染每个链接的 label 和 href', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SocialLinks, {
      props: { links: [{ label: 'GitHub', href: 'https://github.com/x' }] },
    });
    expect(html).toContain('GitHub');
    expect(html).toContain('href="https://github.com/x"');
  });
});
