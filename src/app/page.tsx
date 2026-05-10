"use client";

import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { useChat } from "@/hooks/useChat";

export default function Home() {
  const {
    conversations,
    activeConversation,
    activeConversationId,
    isStreaming,
    setActiveConversationId,
    createNewConversation,
    deleteConversation,
    sendMessage,
    stopStreaming,
  } = useChat();

  return (
    <div className="flex h-full">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />
      <main className="flex-1 overflow-hidden">
        <ChatInterface
          conversation={activeConversation}
          isStreaming={isStreaming}
          onSend={sendMessage}
          onStop={stopStreaming}
          onNewConversation={createNewConversation}
        />
      </main>
    </div>
  );
}
