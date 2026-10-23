"use client";
// Button that switches between light and dark mode and remembers the choice.
import { useState } from "react";

export default function ThemeToggle() {
  // The page script has already set the class, so read the real state from <html>
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-base transition hover:bg-surface-soft"
      suppressHydrationWarning
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
