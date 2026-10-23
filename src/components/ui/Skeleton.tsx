// A pulsing grey block shown while data is loading.

export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-line/70 ${className}`} aria-hidden="true" />;
}
