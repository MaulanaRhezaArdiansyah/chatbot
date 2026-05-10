import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

type Provider = "anthropic" | "openai" | "deepseek";

const PROVIDER_CONFIGS: Record<Provider, { model: string; label: string }> = {
  anthropic: { model: "claude-haiku-4-5-20251001", label: "Claude" },
  openai:    { model: "gpt-4o",            label: "GPT-4o" },
  deepseek:  { model: "deepseek-chat",     label: "DeepSeek" },
};

function getProvider(): Provider {
  const p = (process.env.LLM_PROVIDER ?? "anthropic").toLowerCase();
  if (p in PROVIDER_CONFIGS) return p as Provider;
  throw new Error(`Unsupported LLM_PROVIDER: "${p}". Must be one of: ${Object.keys(PROVIDER_CONFIGS).join(", ")}`);
}

export function createChatModel(streaming = false) {
  const provider = getProvider();

  if (provider === "anthropic") {
    return new ChatAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: PROVIDER_CONFIGS.anthropic.model,
      streaming,
      maxTokens: 4096,
    });
  }

  if (provider === "openai") {
    return new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      modelName: PROVIDER_CONFIGS.openai.model,
      streaming,
      maxTokens: 4096,
    });
  }

  // deepseek — OpenAI-compatible
  return new ChatOpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY!,
    modelName: PROVIDER_CONFIGS.deepseek.model,
    streaming,
    maxTokens: 4096,
    configuration: {
      baseURL: "https://api.deepseek.com/v1",
    },
  });
}

export function getActiveProviderLabel(): string {
  return PROVIDER_CONFIGS[getProvider()].label;
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
