import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setTheme("light");
    } else if (stored === "dark") {
      setTheme("dark");
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="relative p-2 rounded-lg text-[var(--text-secondary)] hover:text-accent
        transition-colors duration-300 cursor-pointer"
      aria-label={`切换到${theme === "dark" ? "亮色" : "暗色"}模式`}
    >
      <div
        className="transition-transform duration-500"
        style={{
          transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg)",
        }}
      >
        {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
      </div>
    </button>
  );
}

