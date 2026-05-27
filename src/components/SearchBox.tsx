import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import Fuse from "fuse.js";

interface Post {
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

interface SearchBoxProps {
  posts: Post[];
}

export default function SearchBox({ posts }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description", "tags"],
        threshold: 0.4,
        includeScore: true,
      }),
    [posts]
  );

  // 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return fuse.search(debouncedQuery).slice(0, 8);
  }, [debouncedQuery, fuse]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    []
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-4 py-2 rounded-lg
            bg-[var(--bg-secondary)] border border-[var(--border-card)]
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:outline-none focus:border-accent
            transition-colors text-sm"
        />
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-card p-2 max-h-80 overflow-y-auto">
          {results.map(({ item }) => (
            <a
              key={item.id}
              href={`/blog/${item.id}`}
              className="block px-3 py-2.5 rounded-lg
                hover:bg-accent/10 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-accent transition-colors">
                {item.title}
              </div>
              {item.description && (
                <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                  {item.description}
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {isOpen && debouncedQuery.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 glass-card p-4 text-center text-sm text-[var(--text-muted)]">
          No results found
        </div>
      )}
    </div>
  );
}
