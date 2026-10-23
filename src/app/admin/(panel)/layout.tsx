"use client";
// Layout of every protected admin page: checks the login, then shows the sidebar and the page.
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Skeleton from "@/components/ui/Skeleton";
import { clearToken, getToken } from "@/lib/auth";
import { useAdminMe } from "@/lib/hooks/useAdmin";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  // Asking the backend who we are also proves the token is still valid (a 401 sends us to the login page)
  const me = useAdminMe();

  // No saved token at all: go to the login page right away
  useEffect(() => {
    if (!getToken()) router.replace("/admin/login");
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  if (me.error) {
    return (
      <div className="mx-auto max-w-md p-8">
        <ErrorMessage message={me.error} onRetry={me.refetch} />
      </div>
    );
  }

  // Do not show any admin content until the login has been confirmed
  if (!me.data) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="lg:pl-64">
      <AdminSidebar admin={me.data} open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={logout} />

      {/* Top bar with the menu button (phones only) */}
      <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-background/90 px-4 backdrop-blur lg:hidden">
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="flex h-9 w-9 items-center justify-center rounded-lg border border-line">
          ☰
        </button>
        <span className="font-display font-bold text-primary">FoodCast Admin</span>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
