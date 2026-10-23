"use client";
// Shows a commodity photo, or a green placeholder with its first letter when there is no photo.
import { useState } from "react";

interface CommodityImageProps {
  src: string | null;
  name: string;
  className?: string; // sets the size and shape from outside
}

export default function CommodityImage({ src, name, className = "" }: CommodityImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-primary-soft font-display text-5xl font-bold text-primary ${className}`} aria-label={name}>
        {name.charAt(0)}
      </div>
    );
  }

  return (
    // Plain <img>: the photos come from the backend, so Next's image optimiser is not needed
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
  );
}
