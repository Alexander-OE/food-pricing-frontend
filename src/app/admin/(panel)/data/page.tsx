"use client";
// Data health: how fresh each data step is, a button to run the refresh, and the history of refresh runs.
import { useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import { rowClass, tableClass, tdClass, thClass } from "@/components/admin/tableStyles";
import AsyncView from "@/components/ui/AsyncView";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Notice, { type NoticeMessage } from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import Skeleton from "@/components/ui/Skeleton";
import { fieldClass } from "@/components/ui/styles";
import { runRefresh } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/errors";
import { formatDateTime, formatMonth } from "@/lib/format";
import { useDataSteps, useRefreshLogs } from "@/lib/hooks/useAdmin";
import { REFRESH_LABELS, REFRESH_TYPES } from "@/lib/labels";
import type { RefreshStatus, RefreshType } from "@/types/admin";

const LOG_PAGE_SIZE = 10;

export default function AdminDataPage() {
  const steps = useDataSteps();
  const [type, setType] = useState<RefreshType | "">("");
  const [status, setStatus] = useState<RefreshStatus | "">("");
  const [page, setPage] = useState(1);
  const logs = useRefreshLogs({ type: type || undefined, status: status || undefined, page, limit: LOG_PAGE_SIZE });

  const [pending, setPending] = useState<RefreshType | "ALL" | null>(null); // the refresh waiting for confirmation
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);

  /** Runs the confirmed refresh, reports the result, then reloads the data on this page. */
  async function confirmRefresh() {
    if (!pending) return;
    setRunning(true);
    try {
      const results = await runRefresh(pending);
      const failed = results.filter((log) => log.status === "FAILED");
      if (failed.length === 0) {
        setNotice({ type: "success", text: `Refresh finished: ${results.length} step${results.length === 1 ? "" : "s"} completed successfully.` });
      } else {
        const names = failed.map((log) => `${REFRESH_LABELS[log.type]}${log.errorMessage ? ` (${log.errorMessage})` : ""}`);
        setNotice({ type: "error", text: `Some steps failed: ${names.join("; ")}` });
      }
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error) });
    } finally {
      setRunning(false);
      setPending(null);
      steps.refetch();
      logs.refetch();
    }
  }

  // Name of the single step waiting for confirmation (used in the dialog title)
  const stepName = pending && pending !== "ALL" ? REFRESH_LABELS[pending] : "";

  return (
    <>
      <PageHeader
        title="Data health"
        subtitle="Is the data up to date? Run a refresh if something is behind."
        action={<Button onClick={() => setPending("ALL")}>Run full refresh</Button>}
      />
      <Notice notice={notice} onDismiss={() => setNotice(null)} />

      <section className="mb-8">
        <AsyncView
          state={steps}
          skeleton={
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-44" />
              ))}
            </div>
          }
        >
          {(data) => (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.map((step) => (
                <Card key={step.type}>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-bold">{REFRESH_LABELS[step.type]}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${step.isFresh ? "bg-fall/10 text-fall" : "bg-accent-soft text-accent"}`}>
                      {step.isFresh ? "✓ Up to date" : "⚠ Behind"}
                    </span>
                  </div>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Latest data month</dt>
                      <dd className="font-semibold">{step.latestDataPeriod ? formatMonth(step.latestDataPeriod) : "None"}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Last success</dt>
                      <dd className="font-semibold">{formatDateTime(step.lastSuccessAt)}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Last attempt</dt>
                      <dd className="flex items-center gap-2 font-semibold">
                        {formatDateTime(step.lastAttemptAt)} <StatusBadge status={step.status} />
                      </dd>
                    </div>
                  </dl>
                  {step.lastError && <p className="mt-3 rounded-lg bg-rise/10 p-2 text-sm text-rise">{step.lastError}</p>}
                  <Button variant="secondary" small className="mt-4" onClick={() => setPending(step.type)}>
                    Run this step
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </AsyncView>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Refresh history</h2>
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as RefreshType | "");
                setPage(1);
              }}
              aria-label="Filter by step"
              className={`${fieldClass} w-auto`}
            >
              <option value="">All steps</option>
              {REFRESH_TYPES.map((item) => (
                <option key={item} value={item}>
                  {REFRESH_LABELS[item]}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as RefreshStatus | "");
                setPage(1);
              }}
              aria-label="Filter by result"
              className={`${fieldClass} w-auto`}
            >
              <option value="">Any result</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="RUNNING">Running</option>
            </select>
          </div>
        </div>
        <AsyncView
          state={logs}
          isEmpty={(data) => data.items.length === 0}
          emptyTitle="No refresh runs match"
          skeleton={<Skeleton className="h-72" />}
        >
          {(data) => (
            <>
              <Card className="overflow-x-auto p-2">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th className={thClass}>Step</th>
                      <th className={thClass}>Result</th>
                      <th className={thClass}>Started by</th>
                      <th className={thClass}>Started</th>
                      <th className={thClass}>Finished</th>
                      <th className={`${thClass} text-right`}>Records</th>
                      <th className={thClass}>Data month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((log) => (
                      <tr key={log.id} className={rowClass}>
                        <td className={`${tdClass} font-semibold`}>{REFRESH_LABELS[log.type]}</td>
                        <td className={tdClass}>
                          <StatusBadge status={log.status} />
                          {log.errorMessage && <p className="mt-1 max-w-xs text-xs text-rise">{log.errorMessage}</p>}
                        </td>
                        <td className={`${tdClass} capitalize`}>{log.trigger}</td>
                        <td className={`${tdClass} whitespace-nowrap`}>{formatDateTime(log.startedAt)}</td>
                        <td className={`${tdClass} whitespace-nowrap`}>{log.finishedAt ? formatDateTime(log.finishedAt) : "—"}</td>
                        <td className={`${tdClass} text-right`}>{log.recordsProcessed}</td>
                        <td className={tdClass}>{log.dataPeriod ? formatMonth(log.dataPeriod) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              <Pagination page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onChange={setPage} />
            </>
          )}
        </AsyncView>
      </section>

      <ConfirmDialog
        open={pending !== null}
        title={pending === "ALL" ? "Run the full refresh?" : `Run "${stepName}" now?`}
        message={
          pending === "ALL"
            ? "This runs every data step in order (prices, indicators, accuracy scoring and forecasts). It can take a little while."
            : "This runs just this one step now and records the result in the history."
        }
        confirmLabel="Run now"
        busy={running}
        onConfirm={confirmRefresh}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
