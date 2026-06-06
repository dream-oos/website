import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect } from 'vitest';
import ProjectCard from '../src/components/ProjectCard.astro';
import type { ProjectEntry } from '../src/content/schemas';

const withLink: ProjectEntry = { id: 'a', data: { title: '外链项目', year: 2025, description: 'desc', link: 'https://example.com' } };
const noLink: ProjectEntry = { id: 'b', data: { title: '内页项目', year: 2024, description: 'desc' } };

describe('ProjectCard', () => {
  it('有 link 时外链且 target=_blank', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(ProjectCard, { props: { project: withLink } });
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('外链项目');
  });
  it('无 link 时指向站内详情页 /projects/{id}', async () => {
    const c = await AstroContainer.create();
    const html = await c.renderToString(ProjectCard, { props: { project: noLink } });
    expect(html).toContain('href="/projects/b"');
  });
});
