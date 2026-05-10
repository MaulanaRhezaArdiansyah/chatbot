"use client";

import { Conversation } from "@/hooks/useChat";
import { useState } from "react";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-gray-100 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
        </div>
        <span className="font-semibold text-gray-900 text-sm">DeepChat</span>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={onNewConversation}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600 border border-brand-200 bg-brand-50 hover:bg-brand-100 transition-colors duration-150"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {conversations.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-8 px-4">
            No conversations yet. Start a new chat!
          </p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="relative group"
            onMouseEnter={() => setHoveredId(conv.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => onSelectConversation(conv.id)}
              className={`flex items-start gap-2 w-full px-3 py-2.5 rounded-lg text-left text-sm transition-colors duration-150 ${
                activeConversationId === conv.id
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="truncate pr-4">{conv.title}</span>
            </button>

            {hoveredId === conv.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
                title="Delete conversation"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">Powered by LangChain</p>
      </div>
    </aside>
  );
}
