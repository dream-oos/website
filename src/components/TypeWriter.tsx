import { useState, useEffect, useCallback, useRef } from "react";

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
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentText = texts[textIndex] ?? "";

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
        // Pause before deleting
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
        className="ml-0.5 inline-block w-[2px] h-[1.1em] bg-accent animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}
