// API calls for the commodity chatbot.
import type { Conversation, SendMessageResponse, StartChatResponse } from "@/types/chat";
import { getData, postData } from "./client";

/** POST /chat/conversations: start a chat about one commodity. */
export function startChat(commoditySlug: string): Promise<StartChatResponse> {
  return postData<StartChatResponse>("/chat/conversations", { commoditySlug });
}

/** POST /chat/conversations/{id}/messages: send a question and get the bot's reply. */
export function sendChatMessage(conversationId: string, message: string): Promise<SendMessageResponse> {
  return postData<SendMessageResponse>(`/chat/conversations/${conversationId}/messages`, { message });
}

/** GET /chat/conversations/{id}: reload an earlier conversation (only works for the same browser session). */
export function getConversation(conversationId: string): Promise<Conversation> {
  return getData<Conversation>(`/chat/conversations/${conversationId}`);
}
