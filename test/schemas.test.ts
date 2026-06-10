import { describe, it, expect } from 'vitest';
import { blogSchema, projectSchema } from '../src/content/schemas';

describe('blogSchema', () => {
  it('接受合法 frontmatter 并把日期转为 Date,draft 默认 false', () => {
    const parsed = blogSchema.parse({ title: 'A', date: '2026-06-01', description: 'd' });
    expect(parsed.date instanceof Date).toBe(true);
    expect(parsed.draft).toBe(false);
  });
  it('接受本地路径或外部 URL 作为封面', () => {
    expect(blogSchema.parse({ title: 'A', date: '2026-06-01', description: 'd', cover: '/images/blog/a.jpg' }).cover)
      .toBe('/images/blog/a.jpg');
    expect(blogSchema.parse({ title: 'B', date: '2026-06-01', description: 'd', cover: 'https://example.com/b.jpg' }).cover)
      .toBe('https://example.com/b.jpg');
  });
  it('cover 不是 URL 或绝对路径时报错', () => {
    expect(() => blogSchema.parse({ title: 'A', date: '2026-06-01', description: 'd', cover: 'images/blog/a.jpg' })).toThrow();
  });
  it('缺少 title 时报错', () => {
    expect(() => blogSchema.parse({ date: '2026-06-01', description: 'd' })).toThrow();
  });
});

describe('projectSchema', () => {
  it('接受合法 frontmatter', () => {
    const p = projectSchema.parse({ title: 'P', year: 2025, description: 'd', link: 'https://x.com' });
    expect(p.year).toBe(2025);
  });
  it('link 非法 URL 时报错', () => {
    expect(() => projectSchema.parse({ title: 'P', year: 2025, description: 'd', link: 'not-a-url' })).toThrow();
  });
});
