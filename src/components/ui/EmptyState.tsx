// A friendly message for "there is nothing to show here yet".

interface EmptyStateProps {
  title: string;
  text?: string;
}

export default function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-8 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-muted">{text}</p>}
    </div>
  );
}
