"use client";
// Feedback page: a short form that sends a message to the team.
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Notice, { type NoticeMessage } from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import { fieldClass, labelClass } from "@/components/ui/styles";
import { sendFeedback } from "@/lib/api/feedback";
import { getErrorMessage } from "@/lib/errors";
import { formatLabel } from "@/lib/format";
import { useCommodities } from "@/lib/hooks/useCommodities";
import type { FeedbackCategory } from "@/types/feedback";

const CATEGORIES: FeedbackCategory[] = ["GENERAL", "BUG", "PREDICTION_ACCURACY", "FEATURE_REQUEST"];
const MIN_LENGTH = 10; // the backend needs at least this many characters
const MAX_LENGTH = 1000;
// All commodities, for the optional "which food is it about" list
const ALL_COMMODITIES = { sort: "name", limit: 100 } as const;

export default function FeedbackPage() {
  const commodities = useCommodities(ALL_COMMODITIES);
  const [category, setCategory] = useState<FeedbackCategory>("GENERAL");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commoditySlug, setCommoditySlug] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (message.trim().length < MIN_LENGTH) {
      setNotice({ type: "error", text: `Please write at least ${MIN_LENGTH} characters.` });
      return;
    }
    setSending(true);
    setNotice(null);
    try {
      // Empty optional fields are left out, because the backend rejects an empty email
      await sendFeedback({
        category,
        message: message.trim(),
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        commoditySlug: commoditySlug || undefined,
      });
      setNotice({ type: "success", text: "Thank you! Your feedback has been sent." });
      setMessage("");
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Send feedback" subtitle="Found a bug, spotted a wrong forecast, or have an idea? Tell us." />
      <Notice notice={notice} onDismiss={() => setNotice(null)} />
      <Card>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={labelClass}>
                What is it about?
              </label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value as FeedbackCategory)} className={fieldClass}>
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="commodity" className={labelClass}>
                Which food? (optional)
              </label>
              <select id="commodity" value={commoditySlug} onChange={(e) => setCommoditySlug(e.target.value)} className={fieldClass}>
                <option value="">Not about one food</option>
                {commodities.data?.items.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              Your message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_LENGTH}
              rows={5}
              required
              className={fieldClass}
              placeholder="Tell us what happened or what you would like to see…"
            />
            <p className="mt-1 text-right text-xs text-muted">
              {message.length} / {MAX_LENGTH}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>
                Name (optional)
              </label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email (optional)
              </label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={150} className={fieldClass} />
            </div>
          </div>

          <Button type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send feedback"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
