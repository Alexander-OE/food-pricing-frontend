"use client";
// Commodity list: every commodity the site tracks, with a quick search box.
import { useState } from "react";
import { rowClass, tableClass, tdClass, thClass } from "@/components/admin/tableStyles";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { fieldClass } from "@/components/ui/styles";
import { formatLabel } from "@/lib/format";
import { useAdminCommodities } from "@/lib/hooks/useAdmin";

export default function AdminCommoditiesPage() {
  const commodities = useAdminCommodities();
  const [search, setSearch] = useState("");

  return (
    <>
      <PageHeader title="Commodities" subtitle="Every food the site tracks." />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filter by name, slug or category…"
        aria-label="Filter commodities"
        className={`${fieldClass} mb-4 max-w-sm`}
      />
      <AsyncView
        state={commodities}
        isEmpty={(data) => data.length === 0}
        emptyTitle="No commodities yet"
        skeleton={<Skeleton className="h-96" />}
      >
        {(data) => {
          // Match the search text against name, slug and category
          const text = search.trim().toLowerCase();
          const rows = data.filter((item) => `${item.name} ${item.slug} ${item.category}`.toLowerCase().includes(text));
          return (
            <Card className="overflow-x-auto p-2">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>ID</th>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>Slug</th>
                    <th className={thClass}>Category</th>
                    <th className={thClass}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.id} className={rowClass}>
                      <td className={`${tdClass} text-muted`}>{item.id}</td>
                      <td className={`${tdClass} font-semibold`}>{item.name}</td>
                      <td className={`${tdClass} font-mono text-xs`}>{item.slug}</td>
                      <td className={tdClass}>{formatLabel(item.category)}</td>
                      <td className={tdClass}>{item.unit}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-muted">
                        No commodity matches “{search}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          );
        }}
      </AsyncView>
    </>
  );
}
