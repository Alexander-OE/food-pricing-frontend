"use client";
// Invisible component that tells the backend each time a public page is opened.
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/api/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent({ type: "PAGE_VIEW", path: pathname });
  }, [pathname]);

  return null;
}
