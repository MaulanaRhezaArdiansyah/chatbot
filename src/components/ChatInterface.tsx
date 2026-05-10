"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Conversation } from "@/hooks/useChat";

interface ChatInterfaceProps {
  conversation: Conversation | null;
  isStreaming: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
  onNewConversation: () => void;
}

export function ChatInterface({
  conversation,
  isStreaming,
  onSend,
  onStop,
  onNewConversation,
}: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {conversation?.title ?? "DeepChat"}
          </h1>
          {conversation && (
            <p className="text-xs text-gray-400 mt-0.5">
              {conversation.messages.length} message{conversation.messages.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Generating…
            </span>
          )}
          <button
            onClick={onNewConversation}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors duration-150"
          >
            New Chat
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {!conversation || conversation.messages.length === 0 ? (
            <EmptyState onSuggest={onSend} />
          ) : (
            conversation.messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                isStreaming={
                  isStreaming && i === conversation.messages.length - 1 && msg.role === "assistant"
                }
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input */}
      <ChatInput onSend={onSend} onStop={onStop} isStreaming={isStreaming} />
    </div>
  );
}

function EmptyState({ onSuggest }: { onSuggest: (msg: string) => void }) {
  const suggestions = [
    "Explain how LangChain works",
    "Write a Python function to sort a list",
    "What are the benefits of TypeScript?",
    "Help me debug this React component",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-5">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">How can I help you today?</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-sm">
        Ask me anything — I&apos;m powered by LangChain.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="px-4 py-3 text-left text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition-all duration-150"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
