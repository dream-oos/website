import { describe, it, expect } from 'vitest';
import {
  excludeDrafts, sortByDateDesc, getRecentPosts, getFeaturedProjects,
} from '../src/lib/content';
import type { PostEntry, ProjectEntry } from '../src/content/schemas';

const post = (id: string, date: string, draft = false): PostEntry => ({
  id, data: { title: id, date: new Date(date), description: '', draft },
});
const proj = (id: string, year: number, order?: number): ProjectEntry => ({
  id, data: { title: id, year, description: '', order },
});

describe('content helpers', () => {
  it('excludeDrafts 去掉草稿', () => {
    expect(excludeDrafts([post('a', '2026-01-01'), post('b', '2026-01-02', true)]).map(p => p.id))
      .toEqual(['a']);
  });
  it('sortByDateDesc 新的在前', () => {
    expect(sortByDateDesc([post('old', '2026-01-01'), post('new', '2026-02-01')]).map(p => p.id))
      .toEqual(['new', 'old']);
  });
  it('getRecentPosts 去草稿+排序+截断', () => {
    const r = getRecentPosts(
      [post('a', '2026-01-01'), post('b', '2026-03-01'), post('c', '2026-02-01', true)], 1);
    expect(r.map(p => p.id)).toEqual(['b']);
  });
  it('getFeaturedProjects 先按 order 升序,无 order 的按 year 降序', () => {
    const r = getFeaturedProjects([proj('x', 2024), proj('y', 2025, 1), proj('z', 2023)], 3);
    expect(r.map(p => p.id)).toEqual(['y', 'x', 'z']);
  });
});
