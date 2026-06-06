import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import PostList from '../src/components/PostList.astro';
import type { PostEntry } from '../src/content/schemas';

const posts: PostEntry[] = [
  { id: 'p1', data: { title: '第一篇', date: new Date('2026-06-01'), description: '', draft: false } },
  { id: 'p2', data: { title: '第二篇', date: new Date('2026-05-01'), description: '', draft: false } },
];

describe('PostList', () => {
  it('渲染标题与 /blog/{id} 链接', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(PostList, { props: { posts } });
    expect(html).toContain('第一篇');
    expect(html).toContain('href="/blog/p1"');
    expect(html).toContain('href="/blog/p2"');
  });
});
