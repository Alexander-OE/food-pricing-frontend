"use client";
// Admin navigation: links to each admin page, who is logged in, and the logout button.
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import type { Admin } from "@/types/admin";

const LINKS = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/analytics", label: "Usage analytics", icon: "📈" },
  { href: "/admin/data", label: "Data health", icon: "🗄️" },
  { href: "/admin/accuracy", label: "Forecast accuracy", icon: "🎯" },
  { href: "/admin/feedback", label: "Feedback", icon: "💬" },
  { href: "/admin/commodities", label: "Commodities", icon: "🌽" },
];

interface AdminSidebarProps {
  admin: Admin;
  open: boolean; // mobile drawer state
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({ admin, open, onClose, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  /** Overview is only active on "/admin" itself, the others for their whole section. */
  function isActive(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Dark backdrop behind the mobile drawer */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-line px-5 font-display text-lg font-extrabold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base text-on-primary">🌿</span>
          FoodCast Admin
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive(link.href) ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface-soft hover:text-ink"
              }`}
            >
              <span aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 border-t border-line p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{admin.name}</p>
              <p className="truncate text-xs text-muted">{admin.email}</p>
            </div>
            <ThemeToggle />
          </div>
          <button
            onClick={onLogout}
            className="w-full rounded-xl border border-line px-3 py-2 text-sm font-semibold text-rise transition hover:bg-rise/10"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
