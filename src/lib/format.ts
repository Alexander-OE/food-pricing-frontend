// Helpers that turn raw numbers and dates from the API into text for the screen.

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const plainNumber = new Intl.NumberFormat("en-NG");

/** 1250 -> "₦1,250" */
export function formatNaira(value: number): string {
  return naira.format(value);
}

/** 12345 -> "12,345" */
export function formatNumber(value: number): string {
  return plainNumber.format(value);
}

/** 9.4 -> "+9.4%", -8 -> "-8%" (always shows the sign). */
export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

/** 0.58 -> "58%" */
export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** "2025-01-01" -> "January 2025" (periods are always the first of a month). */
export function formatMonth(period: string): string {
  return new Date(`${period}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2025-01-01" -> "Jan 25" (short label for chart axes). */
export function formatMonthShort(period: string): string {
  return new Date(`${period}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

/** "2026-10-23" -> "23 Oct" (short label for daily charts). */
export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

/** ISO timestamp -> "23 Oct 2026, 03:33" in Lagos time. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });
}

/** 3725 seconds -> "1h 2m" */
export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/** "PREDICTION_ACCURACY" -> "Prediction accuracy" */
export function formatLabel(value: string): string {
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
