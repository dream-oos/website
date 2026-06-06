import { describe, it, expect } from 'vitest';
import { site } from '../src/config/site';

describe('site config', () => {
  it('有必填字段', () => {
    expect(site.name).toBeTruthy();
    expect(site.tagline).toBeTruthy();
    expect(Array.isArray(site.bio)).toBe(true);
    expect(site.bio.length).toBeGreaterThan(0);
    expect(site.url).toMatch(/^https?:\/\//);
  });
  it('社交链接都有 label 和 href', () => {
    expect(site.socials.length).toBeGreaterThan(0);
    for (const s of site.socials) {
      expect(s.label).toBeTruthy();
      expect(s.href).toBeTruthy();
    }
  });
});
