// Shows a price direction as arrow + word (+ optional percent), so colour is never the only signal.
import { getDirectionLook } from "@/lib/direction";
import { formatPercent } from "@/lib/format";
import type { Direction } from "@/types/commodity";

interface DirectionBadgeProps {
  direction: Direction;
  percent?: number; // when given, the signed percent is shown too
  large?: boolean;
}

export default function DirectionBadge({ direction, percent, large = false }: DirectionBadgeProps) {
  const look = getDirectionLook(direction);
  const size = large ? "px-3.5 py-1.5 text-base" : "px-2.5 py-1 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${size} ${look.soft}`}>
      <span aria-hidden="true">{look.arrow}</span>
      {look.word}
      {percent !== undefined && <span>{formatPercent(percent)}</span>}
    </span>
  );
}
