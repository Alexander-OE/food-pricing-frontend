// A card with a small label, a big number and an optional hint line (used for headline stats).
import Card from "./Card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
}

export default function StatCard({ label, value, hint, className = "" }: StatCardProps) {
  return (
    <Card className={className}>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tracking-tight">{value}</p>
      {hint && <div className="mt-1 text-sm text-muted">{hint}</div>}
    </Card>
  );
}
