"use client";

import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/lib/langchain";

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  const createNewConversation = useCallback(() => {
    const id = uuidv4();
    const conv: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(id);
    return id;
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = uuidv4();
        const conv: Conversation = {
          id: conversationId,
          title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
          messages: [],
          createdAt: new Date(),
        };
        setConversations((prev) => [conv, ...prev]);
        setActiveConversationId(conversationId);
      }

      const userMessage: ChatMessage = { role: "user", content };

      const currentMessages = [
        ...(conversations.find((c) => c.id === conversationId)?.messages ?? []),
        userMessage,
      ];

      setIsStreaming(true);
      let accumulated = "";

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const title =
            c.title === "New Chat" && c.messages.length === 0
              ? content.slice(0, 40) + (content.length > 40 ? "..." : "")
              : c.title;
          return {
            ...c,
            title,
            messages: [...c.messages, userMessage, { role: "assistant" as const, content: "" }],
          };
        })
      );

      try {
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: currentMessages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error("Failed to get response");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.error) {
                  const errMsg = `Error: ${parsed.error}`;
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id !== conversationId) return c;
                      const msgs = [...c.messages];
                      msgs[msgs.length - 1] = { role: "assistant", content: errMsg };
                      return { ...c, messages: msgs };
                    })
                  );
                } else if (parsed.content) {
                  accumulated += parsed.content;
                  const current = accumulated;
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id !== conversationId) return c;
                      const msgs = [...c.messages];
                      msgs[msgs.length - 1] = { role: "assistant", content: current };
                      return { ...c, messages: msgs };
                    })
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== conversationId) return c;
              const msgs = [...c.messages];
              msgs[msgs.length - 1] = {
                role: "assistant",
                content: "Sorry, something went wrong. Please try again.",
              };
              return { ...c, messages: msgs };
            })
          );
        }
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [activeConversationId, conversations, isStreaming]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isStreaming,
    setActiveConversationId,
    createNewConversation,
    deleteConversation,
    sendMessage,
    stopStreaming,
  };
}
