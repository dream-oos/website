import { useEffect, useRef, useState } from "react";

export default function MouseGlow() {
  const [isDesktop, setIsDesktop] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const glowRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Only show on desktop (non-touch, wide screens)
    const mql = window.matchMedia("(min-width: 768px) and (hover: hover)");
    const handleChange = () => setIsDesktop(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.08);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.08);

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${posRef.current.x - 250}px, ${posRef.current.y - 250}px)`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 z-[1] pointer-events-none will-change-transform"
      style={{
        width: 500,
        height: 500,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        opacity: 0.06,
      }}
      aria-hidden="true"
    />
  );
}
