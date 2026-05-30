import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { breakpoints } from '../lib/gsap-init';

export default function MouseGlow() {
  const [enabled, setEnabled] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const targetX = useRef<gsap.QuickToFunc | null>(null);
  const targetY = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(breakpoints.isDesktop, (ctx) => {
      const { conditions } = ctx;
      if (!conditions?.isDesktop) return;

      setEnabled(true);

      const el = glowRef.current;
      if (!el) return;

      // Use quickTo for sub-pixel smooth following (no rAF needed)
      targetX.current = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      targetY.current = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

      const handleMouseMove = (e: MouseEvent) => {
        targetX.current?.(e.clientX - 250);
        targetY.current?.(e.clientY - 250);
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        setEnabled(false);
      };
    });

    return () => mm.revert();
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 z-[1] pointer-events-none will-change-transform"
      style={{
        width: 500,
        height: 500,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
        opacity: 0.06,
      }}
      aria-hidden="true"
    />
  );
}
