// A rounded white card with a soft shadow; `lift` makes it rise a little on hover.

interface CardProps {
  children: React.ReactNode;
  className?: string;
  lift?: boolean;
}

export default function Card({ children, className = "", lift = false }: CardProps) {
  const hover = lift ? "transition duration-300 hover:-translate-y-1 hover:shadow-lift" : "";
  return (
    <div className={`rounded-2xl border border-line bg-surface p-5 shadow-card ${hover} ${className}`}>
      {children}
    </div>
  );
}
