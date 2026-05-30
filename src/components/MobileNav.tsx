import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/gsap-init';

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  links: NavLink[];
  currentPath: string;
}

export default function MobileNav({ links, currentPath }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reduceMotion = useRef(prefersReducedMotion());

  // Build the GSAP timeline
  const buildTimeline = useCallback(() => {
    if (tlRef.current) tlRef.current.kill();

    const backdrop = backdropRef.current;
    const sidebar = sidebarRef.current;
    if (!backdrop || !sidebar) return;

    const links = linkRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const dur = reduceMotion.current ? 0 : 0.35;

    tlRef.current = gsap.timeline({ paused: true });
    tlRef.current
      .set(backdrop, { display: 'block' })
      .set(sidebar, { display: 'flex' })
      .to(backdrop, { opacity: 1, duration: dur * 0.7, ease: 'power2.out' })
      .fromTo(
        sidebar,
        { x: '100%' },
        { x: '0%', duration: dur, ease: 'power3.out' },
        '-=60%'
      );

    if (links.length > 0 && !reduceMotion.current) {
      tlRef.current.fromTo(
        links,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
        '-=65%'
      );
    }

    return tlRef.current;
  }, []);

  // Open: build & play forward
  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';

    // Rebuild on each open in case DOM changed
    const tl = buildTimeline();
    tl?.play();
  }, [buildTimeline]);

  // Close: play reverse then cleanup
  const close = useCallback(() => {
    if (!tlRef.current) {
      setIsOpen(false);
      document.body.style.overflow = '';
      return;
    }

    tlRef.current.eventCallback('onReverseComplete', () => {
      setIsOpen(false);
      document.body.style.overflow = '';
      if (backdropRef.current) backdropRef.current.style.display = 'none';
      if (sidebarRef.current) sidebarRef.current.style.display = 'none';
    });

    tlRef.current.reverse();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={open}
        className="p-2 text-[var(--text-secondary)] hover:text-accent transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm opacity-0"
        style={{ display: 'none' }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className="fixed top-0 right-0 z-50 h-full w-72 glass-card !rounded-none
          flex-col"
        style={{ display: 'none' }}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-card)]">
          <ThemeToggle />
          <button
            onClick={close}
            className="p-2 text-[var(--text-secondary)] hover:text-accent transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {links.map((link, i) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== '/' && currentPath.startsWith(link.href));
            return (
              <a
                key={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  close();
                  // Navigate after close animation
                  setTimeout(() => { window.location.href = link.href; }, 400);
                }}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'text-accent bg-accent/10 font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
