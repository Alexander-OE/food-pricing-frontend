// The big title (and optional subtitle) at the top of a page.

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode; // optional control shown on the right (for example a range picker)
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
