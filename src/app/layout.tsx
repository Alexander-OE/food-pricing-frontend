// Root layout: loads the two fonts, applies the saved light/dark theme and wraps every page.
import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Characterful font for headings and big numbers
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
// Clean font for everything else
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "Lagos Food Price Forecast",
  description: "See where food prices in Lagos are heading next month, and why.",
};

// Runs before the page paints so there is no white flash when dark mode is saved
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${jakarta.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions sometimes add attributes to <body> before React loads */}
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
