import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

interface HitokotoData {
  hitokoto: string;
  from: string;
  from_who?: string;
}

export default function Hitokoto() {
  const [quote, setQuote] = useState("");
  const [source, setSource] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://v1.hitokoto.cn/?encode=json&c=a&c=b&c=c&c=d&c=i&c=k")
      .then((r) => r.json())
      .then((data: HitokotoData) => {
        setQuote(data.hitokoto);
        setSource(data.from_who ? `${data.from_who} - ${data.from}` : data.from);
        setLoading(false);
      })
      .catch(() => {
        setQuote("Code is poetry, and dreams are the horizon.");
        setSource("Dreamer");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!quote) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(quote.slice(0, i));
      if (i >= quote.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 55);
    return () => clearInterval(timer);
  }, [quote]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 text-[var(--text-muted)]">
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-4 px-4" id="hitokoto-section">
      <div className="flex items-start gap-2 max-w-sm">
        <Quote
          size={14}
          className="shrink-0 mt-0.5 opacity-40"
          style={{ color: "#3b9eff" }}
        />
        <p
          className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed text-center"
          id="hitokoto-text"
        >
          {displayed}
          {!done && (
            <span
              className="inline-block w-px h-[1em] ml-0.5 align-middle"
              style={{
                background: "#3b9eff",
                opacity: 0.8,
                animation: "blink 1s step-end infinite",
              }}
            />
          )}
        </p>
        <Quote
          size={14}
          className="shrink-0 mt-0.5 rotate-180 opacity-40"
          style={{ color: "#3b9eff" }}
        />
      </div>
      {done && source && (
        <p className="text-xs text-[var(--text-muted)]" id="hitokoto-source">
          -- {source}
        </p>
      )}
    </div>
  );
}