"use client";
// Hook that runs one chat conversation about a commodity (start, send, restore after refresh).
import { useEffect, useState } from "react";
import { getConversation, sendChatMessage, startChat } from "@/lib/api/chat";
import { getErrorMessage } from "@/lib/errors";
import type { ChatMessage } from "@/types/chat";

export function useChat(slug: string) {
  const storageKey = `chat:${slug}`; // remembers the conversation id for this commodity
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On first load, bring back an earlier conversation if this browser has one
  useEffect(() => {
    const savedId = window.localStorage.getItem(storageKey);
    if (!savedId) return;
    getConversation(savedId)
      .then((conversation) => {
        setConversationId(conversation.id);
        setMessages(conversation.messages);
      })
      .catch(() => window.localStorage.removeItem(storageKey)); // it no longer exists
  }, [storageKey]);

  /** Starts a new conversation and shows the bot's greeting. */
  async function start() {
    setBusy(true);
    setError(null);
    try {
      const chat = await startChat(slug);
      window.localStorage.setItem(storageKey, chat.conversationId);
      setConversationId(chat.conversationId);
      setGreeting(chat.greeting);
      setSuggestions(chat.suggestedQuestions);
      setMessages([]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  /** Sends a question; the user's message appears straight away, then the reply. */
  async function send(text: string) {
    if (!conversationId || busy) return;
    const question: ChatMessage = {
      id: -Date.now(), // temporary id until the server saves it
      role: "USER",
      content: text,
      createdAt: new Date().toISOString(),
      usedFallback: false,
    };
    setMessages((current) => [...current, question]);
    setSuggestions([]);
    setBusy(true);
    setError(null);
    try {
      const response = await sendChatMessage(conversationId, text);
      setMessages((current) => [...current, response.reply]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return { conversationId, messages, greeting, suggestions, busy, error, start, send };
}
