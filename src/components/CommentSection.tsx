import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import "@waline/client/waline.css";

interface CommentSectionProps {
  serverURL: string;
  path?: string;
}

export default function CommentSection({ serverURL, path }: CommentSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ destroy?: () => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !serverURL) return;

    if (instanceRef.current?.destroy) {
      instanceRef.current.destroy();
    }

    import("@waline/client").then(({ init }) => {
      if (!containerRef.current) return;
      instanceRef.current = init({
        el: containerRef.current,
        serverURL,
        path: path || window.location.pathname,
        lang: "zh-CN",
        pageview: true,
        comment: true,
        dark: `html[data-theme="dark"]`,
        locale: {
          placeholder: "Say something... Supports Markdown",
        },
      });
    });

    return () => {
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
      }
    };
  }, [serverURL, path]);

  if (!serverURL) {
    return (
      <div className="glass-card p-8 text-center">
        <MessageCircle
          size={32}
          className="mx-auto mb-3 text-[var(--text-muted)]"
        />
        <p className="text-sm text-[var(--text-muted)]">Comments not configured.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6" id="comment-section">
      <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-6">
        <MessageCircle size={18} style={{ color: "#3b9eff" }} />
        Comments
      </h3>
      <div ref={containerRef} id="waline-container" />
    </div>
  );
}