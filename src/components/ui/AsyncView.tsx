// Decides what to show for a data section: skeleton while loading, error with retry, empty message, or the data.
import type { FetchState } from "@/lib/hooks/useFetch";
import EmptyState from "./EmptyState";
import ErrorMessage from "./ErrorMessage";

interface AsyncViewProps<T> {
  state: FetchState<T>;
  skeleton: React.ReactNode; // shown on the first load
  isEmpty?: (data: T) => boolean; // when true, the empty message is shown
  emptyTitle?: string;
  emptyText?: string;
  children: (data: T) => React.ReactNode; // how to display the data once it has arrived
}

export default function AsyncView<T>({
  state,
  skeleton,
  isEmpty,
  emptyTitle = "Nothing here yet",
  emptyText,
  children,
}: AsyncViewProps<T>) {
  if (state.error) return <ErrorMessage message={state.error} onRetry={state.refetch} />;
  if (state.data === null) return <>{skeleton}</>;
  if (isEmpty?.(state.data)) return <EmptyState title={emptyTitle} text={emptyText} />;
  // While new data is loading (for example after a filter change), keep the old data but fade it
  return <div className={state.loading ? "opacity-60 transition" : "transition"}>{children(state.data)}</div>;
}
