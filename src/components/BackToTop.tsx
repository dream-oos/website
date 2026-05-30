import { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/gsap-init';

export default function BackToTop() {
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = btnRef.current;
    if (!el) return;

    const reduceMotion = prefersReducedMotion();
    const tween = gsap.to(el, {
      opacity: 0,
      y: 16,
      duration: reduceMotion ? 0 : 0.3,
      ease: 'power2.out',
      paused: true,
    });

    const handleScroll = () => {
      const shouldShow = window.scrollY > 500;
      if (shouldShow) {
        tween.reverse();
      } else {
        tween.play();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      tween.kill();
    };
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
  };

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 glass-card !rounded-full p-3
        text-[var(--text-secondary)] hover:text-accent opacity-0 translate-y-4 pointer-events-none
        transition-colors duration-300 cursor-pointer
        hover:border-accent hover:shadow-lg"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
