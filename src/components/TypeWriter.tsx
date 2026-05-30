import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '../lib/gsap-init';

interface TypeWriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function TypeWriter({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const currentText = texts[textIndex] ?? '';

  // GSAP cursor pulse — smoother than CSS animate-pulse
  useEffect(() => {
    if (!cursorRef.current || prefersReducedMotion()) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(cursorRef.current, {
      opacity: 0.2,
      duration: 0.6,
      ease: 'power2.inOut',
    });

    return () => {
      tl.kill();
    };
  }, []);

  const tick = useCallback(() => {
    if (isDeleting) {
      setCharIndex((prev) => prev - 1);
      setDisplayText(currentText.slice(0, charIndex - 1));

      if (charIndex <= 1) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      setCharIndex((prev) => prev + 1);
      setDisplayText(currentText.slice(0, charIndex + 1));

      if (charIndex + 1 >= currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }
    }
  }, [isDeleting, charIndex, currentText, texts.length, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    timeoutRef.current = setTimeout(tick, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tick, isDeleting, deletingSpeed, typingSpeed]);

  return (
    <span className="inline-flex items-center">
      <span>{displayText}</span>
      <span
        ref={cursorRef}
        className="ml-0.5 inline-block w-[2px] h-[1.1em] bg-accent"
        aria-hidden="true"
      />
    </span>
  );
}
