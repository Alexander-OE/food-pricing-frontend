"use client";
// Feedback inbox: read what visitors sent and mark each message as new, reviewed or resolved.
import { useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import AsyncView from "@/components/ui/AsyncView";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Notice, { type NoticeMessage } from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { fieldClass } from "@/components/ui/styles";
import { updateFeedbackStatus } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/errors";
import { formatDateTime, formatLabel } from "@/lib/format";
import { useFeedbackList } from "@/lib/hooks/useAdmin";
import type { AdminFeedback } from "@/types/admin";
import type { FeedbackCategory, FeedbackStatus } from "@/types/feedback";

const PAGE_SIZE = 10;
const STATUSES: FeedbackStatus[] = ["NEW", "REVIEWED", "RESOLVED"];
const CATEGORIES: FeedbackCategory[] = ["GENERAL", "BUG", "PREDICTION_ACCURACY", "FEATURE_REQUEST"];

// A status change that is waiting for the admin to confirm
interface PendingChange {
  item: AdminFeedback;
  status: FeedbackStatus;
}

export default function AdminFeedbackPage() {
  const [status, setStatus] = useState<FeedbackStatus | "">("");
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [page, setPage] = useState(1);
  const feedback = useFeedbackList({ status: status || undefined, category: category || undefined, page, limit: PAGE_SIZE });

  const [pending, setPending] = useState<PendingChange | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);

  /** Saves the confirmed status change, then reloads the list. */
  async function confirmChange() {
    if (!pending) return;
    setSaving(true);
    try {
      await updateFeedbackStatus(pending.item.id, pending.status);
      setNotice({ type: "success", text: `Feedback #${pending.item.id} is now marked as ${formatLabel(pending.status).toLowerCase()}.` });
      feedback.refetch();
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSaving(false);
      setPending(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Feedback"
        subtitle="Messages sent from the public feedback form."
        action={
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as FeedbackStatus | "");
                setPage(1);
              }}
              aria-label="Filter by status"
              className={`${fieldClass} w-auto`}
            >
              <option value="">Any status</option>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as FeedbackCategory | "");
                setPage(1);
              }}
              aria-label="Filter by topic"
              className={`${fieldClass} w-auto`}
            >
              <option value="">Any topic</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {formatLabel(item)}
                </option>
              ))}
            </select>
          </div>
        }
      />
      <Notice notice={notice} onDismiss={() => setNotice(null)} />

      <AsyncView
        state={feedback}
        isEmpty={(data) => data.items.length === 0}
        emptyTitle="No feedback here"
        emptyText="Nothing matches these filters."
        skeleton={
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        }
      >
        {(data) => (
          <>
            <p className="mb-3 text-sm text-muted">{data.meta.total} messages</p>
            <div className="space-y-3">
              {data.items.map((item) => (
                <Card key={item.id} className="animate-fade-up">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold">#{item.id}</span>
                      <span className="rounded-full bg-surface-soft px-2.5 py-0.5 text-xs font-semibold">{formatLabel(item.category)}</span>
                      {item.commodityName && <span className="text-muted">about {item.commodityName}</span>}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-3 whitespace-pre-line">{item.message}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-sm text-muted">
                    <span>
                      {item.name ?? "Anonymous"}
                      {item.email && ` · ${item.email}`} · {formatDateTime(item.createdAt)}
                    </span>
                    <label className="flex items-center gap-2">
                      Mark as
                      <select
                        value={item.status}
                        onChange={(e) => setPending({ item, status: e.target.value as FeedbackStatus })}
                        className={`${fieldClass} w-auto py-1.5`}
                      >
                        {STATUSES.map((option) => (
                          <option key={option} value={option}>
                            {formatLabel(option)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </Card>
              ))}
            </div>
            <Pagination page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />
          </>
        )}
      </AsyncView>

      <ConfirmDialog
        open={pending !== null && pending.status !== pending.item.status}
        title="Change this status?"
        message={pending ? `Mark feedback #${pending.item.id} as ${formatLabel(pending.status).toLowerCase()}?` : ""}
        confirmLabel="Yes, change it"
        busy={saving}
        onConfirm={confirmChange}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
