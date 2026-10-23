// Photo credits: who took each commodity photo and under which licence (required by the licences).
import { formatLabel } from "@/lib/format";
import type { ImageCredit } from "@/types/commodity";

export default function CreditsList({ credits }: { credits: Record<string, ImageCredit> }) {
  const entries = Object.entries(credits).sort(([a], [b]) => a.localeCompare(b));
  return (
    <ul className="divide-y divide-line text-sm">
      {entries.map(([slug, credit]) => (
        <li key={slug} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]">
          <span className="font-semibold">{formatLabel(slug.replace(/-/g, " "))}</span>
          <span className="text-muted">
            <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {credit.title}
            </a>{" "}
            by {credit.author},{" "}
            {credit.licenseUrl ? (
              <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {credit.license}
              </a>
            ) : (
              credit.license
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
