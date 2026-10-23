"use client";
// A row of buttons where exactly one is selected (used for ranges like "7 days / 30 days / 90 days").

interface Option<T> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string; // describes the control for screen readers
}

export default function SegmentedControl<T extends string | number>({ options, value, onChange, label }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex gap-1 rounded-full border border-line bg-surface p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={option.value === value}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            option.value === value ? "bg-primary text-on-primary" : "text-muted hover:text-ink"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
