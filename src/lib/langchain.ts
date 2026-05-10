import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function createDeepSeekModel(streaming = false) {
  return new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY!,
    modelName: "deepseek-chat",
    streaming,
    configuration: {
      baseURL: "https://api.deepseek.com/v1",
    },
    temperature: 0.7,
    maxTokens: 4096,
  });
}

export function convertToLangChainMessages(messages: ChatMessage[]) {
  return messages.map((msg) => {
    if (msg.role === "user") return new HumanMessage(msg.content);
    if (msg.role === "assistant") return new AIMessage(msg.content);
    return new SystemMessage(msg.content);
  });
}

export const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant.
You provide clear, accurate, and thoughtful responses.
When answering technical questions, use code blocks with appropriate syntax highlighting.
Be concise but thorough in your explanations.`;
