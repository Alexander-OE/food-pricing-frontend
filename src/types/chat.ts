// Types for the chatbot endpoints.

export type ChatRole = "USER" | "ASSISTANT";

export interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
  createdAt: string;
  usedFallback: boolean;
}

/** Response of POST /chat/conversations. */
export interface StartChatResponse {
  conversationId: string;
  greeting: string;
  suggestedQuestions: string[];
}

/** Response of POST /chat/conversations/{id}/messages. */
export interface SendMessageResponse {
  reply: ChatMessage;
  conversation: { id: string; messageCount: number };
}

/** Response of GET /chat/conversations/{id}. */
export interface Conversation {
  id: string;
  commoditySlug: string;
  messageCount: number;
  messages: ChatMessage[];
}
