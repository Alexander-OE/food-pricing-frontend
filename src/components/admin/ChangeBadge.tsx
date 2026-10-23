// Arrow + signed percent for admin numbers where growth is good news (visitors, page views).
import { directionFromChange } from "@/lib/direction";
import { formatPercent } from "@/lib/format";

export default function ChangeBadge({ percent, suffix }: { percent: number; suffix?: string }) {
  const direction = directionFromChange(percent);
  const look = { UP: "text-fall", DOWN: "text-rise", STABLE: "text-flat" }[direction];
  const arrow = { UP: "↑", DOWN: "↓", STABLE: "→" }[direction];
  return (
    <span className={`font-semibold ${look}`}>
      <span aria-hidden="true">{arrow}</span> {formatPercent(percent)}
      {suffix && <span className="font-normal text-muted"> {suffix}</span>}
    </span>
  );
}
