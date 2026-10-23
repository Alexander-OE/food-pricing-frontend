"use client";
// Row of category buttons (with counts). Used as links on the home page and as a filter on the browse page.
import Link from "next/link";
import { useCategories } from "@/lib/hooks/useCommodities";
import { formatLabel } from "@/lib/format";
import Skeleton from "@/components/ui/Skeleton";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { CommodityCategory } from "@/types/commodity";

interface CategoryChipsProps {
  selected?: CommodityCategory | ""; // when `onSelect` is given, this one is highlighted
  onSelect?: (category: CommodityCategory | "") => void; // omit to render links to the browse page instead
}

const chipBase = "rounded-full border px-4 py-2 text-sm font-semibold transition";

export default function CategoryChips({ selected = "", onSelect }: CategoryChipsProps) {
  const categories = useCategories();

  if (categories.error) return <ErrorMessage message={categories.error} onRetry={categories.refetch} />;
  if (!categories.data) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full" />
        ))}
      </div>
    );
  }

  // Biggest categories first
  const sorted = [...categories.data].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-wrap gap-2">
      {onSelect && (
        <button
          onClick={() => onSelect("")}
          className={`${chipBase} ${selected === "" ? "border-primary bg-primary text-on-primary" : "border-line bg-surface hover:bg-surface-soft"}`}
        >
          All
        </button>
      )}
      {sorted.map((item) => {
        const label = `${formatLabel(item.category)} (${item.count})`;
        if (!onSelect) {
          return (
            <Link key={item.category} href={`/commodities?category=${item.category}`} className={`${chipBase} border-line bg-surface hover:bg-primary-soft hover:text-primary`}>
              {label}
            </Link>
          );
        }
        const active = selected === item.category;
        return (
          <button
            key={item.category}
            onClick={() => onSelect(item.category)}
            className={`${chipBase} ${active ? "border-primary bg-primary text-on-primary" : "border-line bg-surface hover:bg-surface-soft"}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
