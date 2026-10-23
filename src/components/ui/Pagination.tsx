// Previous / Next buttons with a "Page 2 of 5" label, for the paginated lists.
import Button from "./Button";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, limit, total, onChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / limit));
  if (pageCount === 1) return null;
  return (
    <nav aria-label="Pages" className="mt-6 flex items-center justify-center gap-4">
      <Button variant="secondary" small disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Previous
      </Button>
      <span className="text-sm text-muted">
        Page {page} of {pageCount}
      </span>
      <Button variant="secondary" small disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
        Next →
      </Button>
    </nav>
  );
}
