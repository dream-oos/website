import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";

interface TwikooConfig {
  envId: string;
  [key: string]: unknown;
}

interface WalineConfig {
  serverURL: string;
  [key: string]: unknown;
}

interface CommentSectionProps {
  provider: "twikoo" | "waline" | "none";
  configs?: TwikooConfig | WalineConfig;
}

export default function CommentSection({
  provider,
  configs,
}: CommentSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(provider !== "none");
  const [error, setError] = useState("");
  const initRef = useRef(false);

  useEffect(() => {
    if (provider === "none" || initRef.current) return;
    initRef.current = true;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    const init = async () => {
      try {
        if (provider === "twikoo") {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/twikoo@1/dist/twikoo.all.min.js"
          );
          const twikoo = (window as unknown as Record<string, { init: (cfg: Record<string, unknown>) => void }>).twikoo;
          if (twikoo && containerRef.current) {
            twikoo.init({
              el: containerRef.current,
              ...(configs as TwikooConfig),
            });
          }
        } else if (provider === "waline") {
          await loadScript(
            "https://unpkg.com/@waline/client@v3/dist/waline.js"
          );
          const Waline = (window as unknown as Record<string, { init: (cfg: Record<string, unknown>) => unknown }>).Waline;
          if (Waline && containerRef.current) {
            Waline.init({
              el: containerRef.current,
              ...(configs as WalineConfig),
            });
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [provider, configs]);

  if (provider === "none") {
    return (
      <div className="glass-card p-8 text-center">
        <MessageCircle
          size={32}
          className="mx-auto mb-3 text-[var(--text-muted)]"
        />
        <p className="text-sm text-[var(--text-muted)]">
          Comments are not enabled for this post.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--text-primary)] mb-4">
        <MessageCircle size={20} className="text-accent" />
        Comments
      </h3>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-sm text-[var(--text-muted)]">
            Loading comments...
          </span>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-sm text-red-400">{error}</div>
      )}

      <div ref={containerRef} />
    </div>
  );
}
