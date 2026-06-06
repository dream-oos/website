import type { PostEntry, ProjectEntry } from '../content/schemas';

export function excludeDrafts(posts: PostEntry[]): PostEntry[] {
  return posts.filter((p) => !p.data.draft);
}

export function sortByDateDesc(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getRecentPosts(posts: PostEntry[], limit: number): PostEntry[] {
  return sortByDateDesc(excludeDrafts(posts)).slice(0, limit);
}

export function getFeaturedProjects(projects: ProjectEntry[], limit: number): ProjectEntry[] {
  const sorted = [...projects].sort((a, b) => {
    const ao = a.data.order ?? Number.POSITIVE_INFINITY;
    const bo = b.data.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return b.data.year - a.data.year;
  });
  return sorted.slice(0, limit);
}
