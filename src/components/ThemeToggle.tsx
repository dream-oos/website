import { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/gsap-init';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setTheme('light');
    } else if (stored === 'dark') {
      setTheme('dark');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    if (iconRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        iconRef.current,
        { rotation: 0, scale: 1 },
        {
          rotation: 360,
          scale: 0.6,
          duration: 0.35,
          ease: 'back.in(2)',
          onComplete: () => {
            gsap.to(iconRef.current, {
              scale: 1,
              duration: 0.25,
              ease: 'back.out(2)',
            });
          },
        }
      );
    }
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-accent
        transition-colors duration-300 cursor-pointer"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div ref={iconRef}>
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </div>
    </button>
  );
}
