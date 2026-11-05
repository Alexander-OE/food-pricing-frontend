"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AsyncView from "@/components/ui/AsyncView";
import Pagination from "@/components/ui/Pagination";
import { fieldClass } from "@/components/ui/styles";
import { trackEvent } from "@/lib/api/analytics";
import { useCommodities } from "@/lib/hooks/useCommodities";
import type { CommodityCategory, CommoditySort, Direction } from "@/types/commodity";
import CategoryChips from "./CategoryChips";
import CommodityTile from "./CommodityTile";
import TileGridSkeleton from "./TileGridSkeleton";

const PAGE_SIZE = 12;

// The browse page: search box, category chips, filters, a grid of commodities and paging.

export default function BrowseView() {
  // A category link from the home page arrives as ?category=GRAINS
  const initialCategory = (useSearchParams().get("category") ?? "") as CommodityCategory | "";

  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState(""); 
  const [category, setCategory] = useState<CommodityCategory | "">(initialCategory);
  const [direction, setDirection] = useState<Direction | "">("");
  const [sort, setSort] = useState<CommoditySort>("name");
  const [page, setPage] = useState(1);

  // Wait until the visitor stops typing before searching, and tell the backend what was searched
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText.trim());
      setPage(1);
      if (searchText.trim()) {
        trackEvent({ type: "SEARCH", path: "/commodities", metadata: { query: searchText.trim() } });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const commodities = useCommodities({
    search: search || undefined,
    category: category || undefined,
    direction: direction || undefined,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px]">
        <input
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          maxLength={100}
          placeholder="Search for a food, like rice or tomato…"
          aria-label="Search commodities"
          className={`${fieldClass} sm:col-span-2 lg:col-span-1`}
        />
        <select
          value={direction}
          onChange={(event) => {
            setDirection(event.target.value as Direction | "");
            setPage(1);
          }}
          aria-label="Filter by forecast direction"
          className={fieldClass}
        >
          <option value="">Any forecast</option>
          <option value="UP">↑ Rising</option>
          <option value="DOWN">↓ Falling</option>
          <option value="STABLE">→ Steady</option>
        </select>
        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value as CommoditySort);
            setPage(1);
          }}
          aria-label="Sort commodities"
          className={fieldClass}
        >
          <option value="name">Name (A to Z)</option>
          <option value="price">Highest price</option>
          <option value="-change">Biggest expected rise</option>
          <option value="change">Smallest expected rise or biggest drop</option>
        </select>
      </div>

      <div className="mb-6">
        <CategoryChips
          selected={category}
          onSelect={(next) => {
            setCategory(next);
            setPage(1);
          }}
        />
      </div>

      <AsyncView
        state={commodities}
        isEmpty={(data) => data.items.length === 0}
        emptyTitle="No commodities match"
        emptyText="Try a different search or clear a filter."
        skeleton={<TileGridSkeleton count={PAGE_SIZE} />}
      >
        {(data) => (
          <>
            <p className="mb-4 text-sm text-muted">
              {data.meta.total} {data.meta.total === 1 ? "commodity" : "commodities"}
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.items.map((commodity, index) => (
                <CommodityTile key={commodity.id} commodity={commodity} index={index} />
              ))}
            </div>
            <Pagination page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />
          </>
        )}
      </AsyncView>
    </div>
  );
}
