// ============================================================
//  gsap-init.ts — GSAP initialization & shared animation utilities
// ============================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins (tree-shakeable in GSAP 3.x)
gsap.registerPlugin(ScrollTrigger);

// ── Responsive & accessibility ──────────────────────────────
const mm = gsap.matchMedia();

// Respect prefers-reduced-motion: skip/duration=0 when user prefers reduced motion
mm.add('(prefers-reduced-motion: reduce)', () => {
  // We don't create animations here; this handler simply exists
  // so matchMedia tracks the condition.
  // Components read isReducedMotion below to adjust their animations.
});

// ── Named breakpoints for reusable responsive conditions ────
const breakpoints = {
  isDesktop: '(min-width: 768px) and (hover: hover)',
  isMobile: '(max-width: 767px), (hover: none)',
};

// ── Shared defaults ─────────────────────────────────────────
gsap.defaults({
  duration: 0.6,
  ease: 'power2.out',
});

// ── Shared utilities ────────────────────────────────────────

/** Check if user prefers reduced motion (call after mount) */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Create a ScrollTrigger with reduced-motion awareness */
export function createScrollTrigger(
  vars: gsap.plugins.ScrollTrigger.Vars
): ScrollTrigger {
  if (prefersReducedMotion()) {
    return ScrollTrigger.create({
      ...vars,
      // In reduced motion, just toggle visibility immediately
      onEnter() {
        if (vars.onEnter) vars.onEnter();
      },
      onLeave() {
        if (vars.onLeave) vars.onLeave();
      },
      onEnterBack() {
        if (vars.onEnterBack) vars.onEnterBack();
      },
      onLeaveBack() {
        if (vars.onLeaveBack) vars.onLeaveBack();
      },
    });
  }
  return ScrollTrigger.create(vars);
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
  const { stagger = 0.08, y = 40, duration = 0.7 } = options ?? {};

  if (prefersReducedMotion()) {
    gsap.set(elements, { opacity: 1, y: 0 });
    return;
  }

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
  const { speed = 0.3, scrub = true } = options ?? {};

  if (prefersReducedMotion()) return;

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

/** Navigation show/hide on scroll direction (forward = hide) */
export function navScrollHide(navElement: gsap.DOMTarget): void {
  if (prefersReducedMotion()) return;

  let lastScroll = 0;

  ScrollTrigger.create({
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
export { gsap, ScrollTrigger, mm, breakpoints };
export default gsap;
