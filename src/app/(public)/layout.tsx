// Layout of the public site: navbar on top, footer at the bottom, page views tracked.
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import PageViewTracker from "@/components/layout/PageViewTracker";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageViewTracker />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
