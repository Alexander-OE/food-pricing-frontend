// Shows whether the backend service and its database are working right now.
import Card from "@/components/ui/Card";
import { formatUptime } from "@/lib/format";
import type { Health } from "@/types/market";

export default function HealthCard({ health }: { health: Health }) {
  const healthy = health.status === "ok";
  return (
    <Card>
      <h3 className="mb-3 font-display text-xl font-bold">Service status</h3>
      <p className={`text-lg font-bold ${healthy ? "text-fall" : "text-rise"}`}>
        {healthy ? "✓ All systems working" : "⚠ Running with problems"}
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Database</dt>
          <dd className={`font-semibold ${health.db === "up" ? "text-fall" : "text-rise"}`}>{health.db === "up" ? "Online" : "Offline"}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Running for</dt>
          <dd className="font-semibold">{formatUptime(health.uptime)}</dd>
        </div>
      </dl>
    </Card>
  );
}
