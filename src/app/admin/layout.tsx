// Layout shared by all /admin pages. The admin site is hidden from search engines and has no public navbar.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FoodCast Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
