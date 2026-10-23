"use client";
// Chat panel where visitors ask FoodCast questions about one commodity.
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { fieldClass } from "@/components/ui/styles";
import { useChat } from "@/lib/hooks/useChat";

const MAX_LENGTH = 500; // the backend rejects longer messages

/** One speech bubble; the user's are green and on the right, the bot's are grey and on the left. */
function Bubble({ text, fromUser }: { text: string; fromUser: boolean }) {
  return (
    <div className={`flex ${fromUser ? "justify-end" : "justify-start"} animate-fade-up`}>
      <p
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          fromUser ? "rounded-br-sm bg-primary text-on-primary" : "rounded-bl-sm bg-surface-soft text-ink"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

export default function ChatBox({ slug, name }: { slug: string; name: string }) {
  const chat = useChat(slug);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [chat.messages.length, chat.busy]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    chat.send(text);
  }

  // Before a chat exists, show an invitation
  if (!chat.conversationId) {
    return (
      <Card className="text-center">
        <p className="text-3xl">💬</p>
        <h3 className="mt-2 font-display text-xl font-bold">Ask FoodCast about {name}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">
          Why is the price moving? Should you buy now or wait? Get a short answer based on the forecast above.
        </p>
        {chat.error && <p className="mt-3 text-sm font-medium text-rise">{chat.error}</p>}
        <Button className="mt-4" onClick={chat.start} disabled={chat.busy}>
          {chat.busy ? "Starting…" : "Start chatting"}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col p-0">
      <div className="border-b border-line px-5 py-3">
        <h3 className="font-display text-lg font-bold">Chat about {name}</h3>
      </div>

      <div className="max-h-96 min-h-48 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite">
        {chat.greeting && <Bubble text={chat.greeting} fromUser={false} />}
        {chat.messages.map((message) => (
          <Bubble key={message.id} text={message.content} fromUser={message.role === "USER"} />
        ))}
        {chat.busy && <p className="animate-pulse text-sm text-muted">FoodCast is typing…</p>}
        <div ref={bottomRef} />
      </div>

      {/* Suggested starter questions, hidden once the conversation begins */}
      {chat.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {chat.suggestions.map((question) => (
            <button
              key={question}
              onClick={() => chat.send(question)}
              disabled={chat.busy}
              className="rounded-full border border-line px-3 py-1.5 text-left text-xs font-medium text-primary transition hover:bg-primary-soft disabled:opacity-50"
            >
              {question}
            </button>
          ))}
        </div>
      )}

      {chat.error && <p className="px-5 pb-2 text-sm font-medium text-rise">{chat.error}</p>}

      <form onSubmit={submit} className="flex gap-2 border-t border-line p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Type your question…"
          aria-label="Your question"
          className={fieldClass}
        />
        <Button type="submit" disabled={chat.busy || draft.trim() === ""}>
          Send
        </Button>
      </form>
    </Card>
  );
}
