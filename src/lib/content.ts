type PostLike = { data: { date: Date; draft?: boolean } };
type ProjectLike = { data: { year: number; order?: number } };

export function excludeDrafts<T extends PostLike>(posts: T[]): T[] {
  return posts.filter((p) => !p.data.draft);
}

export function sortByDateDesc<T extends PostLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getRecentPosts<T extends PostLike>(posts: T[], limit: number): T[] {
  return sortByDateDesc(excludeDrafts(posts)).slice(0, limit);
}

export function getFeaturedProjects<T extends ProjectLike>(projects: T[], limit: number): T[] {
  const sorted = [...projects].sort((a, b) => {
    const ao = a.data.order ?? Number.POSITIVE_INFINITY;
    const bo = b.data.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return b.data.year - a.data.year;
  });
  return sorted.slice(0, limit);
}
