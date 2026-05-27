import { useState, useEffect, useRef } from "react";
import { List } from "lucide-react";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0 && visible[0].target.id) {
          setActiveSlug(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  const handleClick = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (headings.length === 0) return null;

  // Determine min depth for indentation base
  const minDepth = Math.min(...headings.map((h) => h.depth));

  return (
    <nav className="glass-card p-4 sticky top-24">
      <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[var(--text-primary)]">
        <List size={16} className="text-accent" />
        <span>目录</span>
      </div>
      <ul className="space-y-1">
        {headings.map((heading) => {
          const indent = (heading.depth - minDepth) * 12;
          const isActive = activeSlug === heading.slug;
          return (
            <li key={heading.slug}>
              <button
                onClick={() => handleClick(heading.slug)}
                className={`block w-full text-left text-xs py-1.5 pr-2 rounded transition-colors duration-200 cursor-pointer
                  border-l-2
                  ${
                    isActive
                      ? "text-accent border-accent bg-accent/5 font-medium"
                      : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                  }`}
                style={{ paddingLeft: `${indent + 12}px` }}
              >
                {heading.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
