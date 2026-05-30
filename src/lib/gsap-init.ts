// ============================================================
//  gsap-init.ts — GSAP initialization & shared animation utilities
//  SSR-safe: browser-only code is guarded with typeof window checks.
// ============================================================
import gsap from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

// ── SSR guard ────────────────────────────────────────────────
const isBrowser = typeof window !== 'undefined';

// ── Plugin & matchMedia (lazy, browser-only) ─────────────────
let ScrollTriggerModule: typeof ST | null = null;
let mm: gsap.MatchMedia | null = null;

function ensurePlugins(): typeof ST {
  if (!isBrowser) {
    throw new Error('GSAP plugins can only be used in the browser');
  }
  if (!ScrollTriggerModule) {
    // Dynamic import avoids SSR issues
    const st = require('gsap/ScrollTrigger') as typeof import('gsap/ScrollTrigger');
    ScrollTriggerModule = st.ScrollTrigger;
    gsap.registerPlugin(ScrollTriggerModule);
  }
  return ScrollTriggerModule;
}

function getMatchMedia(): gsap.MatchMedia {
  if (!isBrowser) {
    throw new Error('gsap.matchMedia() can only be used in the browser');
  }
  if (!mm) {
    mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Tracked so matchMedia condition is available.
      // Components check prefersReducedMotion() independently.
    });
  }
  return mm;
}

// ── Named breakpoints ────────────────────────────────────────
const breakpoints = {
  isDesktop: '(min-width: 768px) and (hover: hover)',
  isMobile: '(max-width: 767px), (hover: none)',
};

// ── Shared defaults (safe to call in SSR — GSAP core is SSR-safe) ──
gsap.defaults({
  duration: 0.6,
  ease: 'power2.out',
});

// ── Shared utilities ────────────────────────────────────────

/** Check if user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (!isBrowser) return true; // SSR: assume reduced motion
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Lazy access to ScrollTrigger (throws in SSR) */
export function getScrollTrigger(): typeof ST {
  return ensurePlugins();
}

/** Lazy access to matchMedia instance (throws in SSR) */
export function getMM(): gsap.MatchMedia {
  return getMatchMedia();
}

/** Animate elements with a staggered scroll reveal */
export function scrollReveal(
  elements: gsap.DOMTarget,
  options?: {
    stagger?: number;
    y?: number;
    duration?: number;
  }
): void {
  if (!isBrowser) return;
  const { stagger = 0.08, y = 40, duration = 0.7 } = options ?? {};

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

  const ST = ensurePlugins();
  gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: Array.isArray(elements) ? elements[0] : elements,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/** Smooth parallax effect on scroll */
export function parallax(
  element: gsap.DOMTarget,
  options?: { speed?: number; scrub?: boolean }
): void {
  if (!isBrowser) return;
  const { speed = 0.3, scrub = true } = options ?? {};

  if (prefersReducedMotion()) return;

  const ST = ensurePlugins();
  gsap.fromTo(
    element,
    { y: 0 },
    {
      y: () => window.innerHeight * speed * -0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
      },
    }
  );
}

/** Navigation show/hide on scroll direction */
export function navScrollHide(navElement: gsap.DOMTarget): void {
  if (!isBrowser) return;
  if (prefersReducedMotion()) return;

  const ST = ensurePlugins();
  let lastScroll = 0;

  ST.create({
    start: 'top -80',
    end: 'max',
    onUpdate(self) {
      const currentScroll = self.scroll();
      const isScrollingDown = currentScroll > lastScroll;

      if (isScrollingDown && currentScroll > 100) {
        gsap.to(navElement, { yPercent: -100, duration: 0.3, ease: 'power2.inOut' });
      } else {
        gsap.to(navElement, { yPercent: 0, duration: 0.3, ease: 'power2.inOut' });
      }

      lastScroll = currentScroll;
    },
  });
}

// ── Exports ─────────────────────────────────────────────────
export { gsap, breakpoints };
export type { ST as ScrollTrigger };
export default gsap;
