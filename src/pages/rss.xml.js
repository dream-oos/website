import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getRecentPosts } from '../lib/content';
import { site } from '../data/site';

export async function GET(context) {
  const posts = getRecentPosts(await getCollection('blog'), 50);
  return rss({
    title: site.name,
    description: site.tagline,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
