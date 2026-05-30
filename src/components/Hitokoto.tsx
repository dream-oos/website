import { useEffect, useState, useRef } from 'react';
import { Quote } from 'lucide-react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/gsap-init';

interface HitokotoData {
  hitokoto: string;
  from: string;
  from_who?: string;
}

export default function Hitokoto() {
  const [quote, setQuote] = useState('');
  const [source, setSource] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const textRef = useRef<HTMLParagraphElement>(null);
  const sourceRef = useRef<HTMLParagraphElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    fetch('https://v1.hitokoto.cn/?encode=json&c=a&c=b&c=c&c=d&c=i&c=k')
      .then((r) => r.json())
      .then((data: HitokotoData) => {
        setQuote(data.hitokoto);
        setSource(data.from_who ? `${data.from_who} - ${data.from}` : data.from);
        setLoading(false);
      })
      .catch(() => {
        setQuote('Code is poetry, and dreams are the horizon.');
        setSource('Dreamer');
        setLoading(false);
      });
  }, []);

  // GSAP typewriter: animate displayed text character by character
  useEffect(() => {
    if (!quote || !textRef.current) return;

    const reduceMotion = prefersReducedMotion();
    const chars = quote.split('');
    const obj = { count: 0 };

    // GSAP cursor blink
    if (cursorRef.current && !reduceMotion) {
      const cursorTl = gsap.timeline({ repeat: -1, yoyo: true });
      cursorTl.to(cursorRef.current, { opacity: 0.15, duration: 0.5, ease: 'power2.inOut' });
    }

    const tween = gsap.to(obj, {
      count: chars.length,
      duration: Math.max(0.8, chars.length * 0.04),
      ease: 'none',
      onUpdate: () => {
        const idx = Math.floor(obj.count);
        if (textRef.current) {
          textRef.current.textContent = chars.slice(0, idx).join('');
        }
      },
      onComplete: () => {
        setDone(true);
        // Animate source in
        if (sourceRef.current) {
          gsap.fromTo(
            sourceRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          );
        }
      },
    });

    return () => {
      tween.kill();
    };
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
          style={{ color: '#3b9eff' }}
        />
        <p
          ref={textRef}
          className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed text-center"
          id="hitokoto-text"
        >
          {/* Text rendered via GSAP onUpdate */}
        </p>
        {!done && (
          <span
            ref={cursorRef}
            className="inline-block w-px h-[1em] ml-0.5 align-middle"
            style={{ background: '#3b9eff', opacity: 0.8 }}
          />
        )}
        <Quote
          size={14}
          className="shrink-0 mt-0.5 rotate-180 opacity-40"
          style={{ color: '#3b9eff' }}
        />
      </div>
      <p
        ref={sourceRef}
        className="text-xs text-[var(--text-muted)] opacity-0"
        id="hitokoto-source"
      >
        {source && `-- ${source}`}
      </p>
    </div>
  );
}
