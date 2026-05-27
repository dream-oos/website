import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

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

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-[var(--text-secondary)] hover:text-accent transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <nav
        className={`fixed top-0 right-0 z-50 h-full w-72 glass-card !rounded-none
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-card)]">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-[var(--text-secondary)] hover:text-accent transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {links.map((link) => {
            const isActive =
              currentPath === link.href ||
              (link.href !== "/" && currentPath.startsWith(link.href));
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "text-accent bg-accent/10 font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
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
