import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import TagFilter from "./TagFilter";

interface Post {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
}

interface BlogListProps {
  posts: Post[];
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll-triggered entrance animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hover tilt effect
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  }, []);

  const formattedDate = new Date(post.pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a
      ref={cardRef}
      href={`/blog/${post.id}`}
      className={`block glass-card p-5 transition-all duration-500 ease-out will-change-transform
        hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 group
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        transitionDelay: `${index * 60}ms`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-2">
        <Calendar size={12} />
        <time dateTime={post.pubDate}>{formattedDate}</time>
      </div>

      <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-accent transition-colors mb-2">
        {post.title}
      </h3>

      {post.description && (
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
          {post.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
        <ArrowRight
          size={14}
          className="text-[var(--text-muted)] group-hover:text-accent group-hover:translate-x-1 transition-all"
        />
      </div>
    </a>
  );
}

export default function BlogList({ posts }: BlogListProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return posts;
    return posts.filter((post) =>
      selectedTags.some((tag) => post.tags.includes(tag))
    );
  }, [posts, selectedTags]);

  // Group by year
  const groupedByYear = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    for (const post of filteredPosts) {
      const year = new Date(post.pubDate).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(post);
    }
    // Sort years descending
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredPosts]);

  let cardIndex = 0;

  return (
    <div className="space-y-8">
      {/* Tag filter */}
      <TagFilter
        tags={allTags}
        selectedTags={selectedTags}
        onTagChange={setSelectedTags}
      />

      {/* Posts grouped by year */}
      {groupedByYear.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">
          No posts found matching the selected tags.
        </div>
      )}

      {groupedByYear.map(([year, yearPosts]) => (
        <section key={year}>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-accent">#</span>
            {year}
            <span className="text-xs text-[var(--text-muted)] font-normal">
              ({yearPosts.length})
            </span>
          </h2>
          <div className="grid gap-4">
            {yearPosts.map((post) => {
              const idx = cardIndex++;
              return <PostCard key={post.id} post={post} index={idx} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
