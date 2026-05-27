import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  phase: number;
  phaseSpeed: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const count = Math.floor(Math.random() * 31) + 50; // 50-80
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, // 1-3px
        opacity: Math.random() * 0.4 + 0.1, // 0.1-0.5
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.01 + 0.005,
      }));
    };

    // Accent color in RGB (matches --color-accent: oklch(0.72 0.15 220) ≈ cyan-blue)
    const accentRgb = { r: 0, g: 180, b: 255 };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Sinusoidal drift
        p.phase += p.phaseSpeed;
        p.x += p.speedX + Math.sin(p.phase) * 0.2;
        p.y += p.speedY + Math.cos(p.phase) * 0.15;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${p.opacity})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
