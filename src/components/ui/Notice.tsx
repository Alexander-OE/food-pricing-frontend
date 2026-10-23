// A green (success) or red (error) message bar that can be dismissed.

export interface NoticeMessage {
  type: "success" | "error";
  text: string;
}

interface NoticeProps {
  notice: NoticeMessage | null;
  onDismiss: () => void;
}

export default function Notice({ notice, onDismiss }: NoticeProps) {
  if (!notice) return null;
  const look = notice.type === "success" ? "border-fall/30 bg-fall/10 text-fall" : "border-rise/30 bg-rise/10 text-rise";
  return (
    <div role="status" className={`mb-4 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm font-medium animate-fade-in ${look}`}>
      <span>{notice.text}</span>
      <button onClick={onDismiss} className="font-bold opacity-70 hover:opacity-100" aria-label="Dismiss message">
        ✕
      </button>
    </div>
  );
}
