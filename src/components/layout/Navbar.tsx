"use client";
// Top navigation bar of the public site (only links to public pages).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/commodities", label: "Browse prices" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/feedback", label: "Feedback" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu

  /** The Home link is only active on "/", the others for their whole section. */
  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base text-on-primary">🌿</span>
          FoodCast
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href) ? "bg-primary-soft text-primary" : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
            aria-expanded={open}
            suppressHydrationWarning // some browser extensions rewrite the text inside buttons
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-line px-4 py-3 md:hidden animate-fade-in" aria-label="Mobile">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold ${
                isActive(link.href) ? "bg-primary-soft text-primary" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
