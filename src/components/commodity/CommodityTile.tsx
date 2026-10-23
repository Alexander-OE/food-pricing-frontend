// A clickable card for one commodity: photo, current price and next month's forecast.
import Link from "next/link";
import DirectionBadge from "@/components/ui/DirectionBadge";
import { formatConfidence, formatNaira } from "@/lib/format";
import type { CommodityCard } from "@/types/commodity";
import CommodityImage from "./CommodityImage";

interface CommodityTileProps {
  commodity: CommodityCard;
  index?: number; // position in the list, used to stagger the fade-in
}

export default function CommodityTile({ commodity, index = 0 }: CommodityTileProps) {
  return (
    <Link
      href={`/commodities/${commodity.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="overflow-hidden">
        <CommodityImage
          src={commodity.imageUrl}
          name={commodity.name}
          className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight">{commodity.name}</h3>
          <span className="shrink-0 rounded-full bg-surface-soft px-2 py-0.5 text-xs text-muted">{commodity.unit}</span>
        </div>
        <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">{formatNaira(commodity.currentPrice)}</p>
        <p className="text-xs text-muted">now</p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
          <div>
            <p className="text-xs text-muted">Next month</p>
            <p className="font-display text-lg font-bold">{formatNaira(commodity.predictedPrice)}</p>
          </div>
          <div className="text-right">
            <DirectionBadge direction={commodity.direction} percent={commodity.percentChange} />
            <p className="mt-1 text-xs text-muted">{formatConfidence(commodity.confidence)} confident</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
