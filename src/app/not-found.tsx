// Shown when someone opens a page that does not exist.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">We could not find that page</h1>
      <p className="mt-2 text-muted">The link may be old, or the address may have a typo.</p>
      <Link href="/" className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90">
        Back to the home page
      </Link>
    </main>
  );
}
