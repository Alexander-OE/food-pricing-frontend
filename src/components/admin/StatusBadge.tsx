// Small coloured label for a refresh status or a feedback status (always has a word and a symbol).

const LOOKS: Record<string, { text: string; classes: string }> = {
  SUCCESS: { text: "✓ Success", classes: "bg-fall/10 text-fall" },
  FAILED: { text: "✗ Failed", classes: "bg-rise/10 text-rise" },
  RUNNING: { text: "… Running", classes: "bg-accent-soft text-accent" },
  NEW: { text: "● New", classes: "bg-accent-soft text-accent" },
  REVIEWED: { text: "◐ Reviewed", classes: "bg-primary-soft text-primary" },
  RESOLVED: { text: "✓ Resolved", classes: "bg-fall/10 text-fall" },
};

export default function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-muted">No runs yet</span>;
  const look = LOOKS[status] ?? { text: status, classes: "bg-flat/15 text-flat" };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${look.classes}`}>{look.text}</span>;
}
