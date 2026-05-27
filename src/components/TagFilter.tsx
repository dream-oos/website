interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onTagChange,
}: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onTagChange([]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={clearAll}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
          ${
            selectedTags.length === 0
              ? "bg-accent text-white"
              : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-card)]"
          }`}
      >
        All
      </button>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "bg-accent text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] border border-[var(--border-card)]"
              }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
