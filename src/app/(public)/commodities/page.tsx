// Browse page: every commodity with search, filters and paging.
import { Suspense } from "react";
import BrowseView from "@/components/commodity/BrowseView";
import PageHeader from "@/components/ui/PageHeader";

export default function CommoditiesPage() {
  return (
    <>
      <PageHeader title="Browse prices" subtitle="Current prices and next month's forecast for every food we track." />
      {/* Suspense is needed because BrowseView reads the URL's query string */}
      <Suspense>
        <BrowseView />
      </Suspense>
    </>
  );
}
