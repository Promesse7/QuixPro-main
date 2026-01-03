'use client';

import { useParams } from 'next/navigation';
import { useChat } from '@/lib/hooks/useChat';
import ChatWindow from '@/components/chat/ChatWindow';
import { ChatLayoutProvider } from '@/components/chat/ThreePanelChatLayout';

export default function ChatPage() {
  const params = useParams();
  const groupId = params ? (params.groupId as string) : null;

  const { messages, typingUsers, sendMessage, error } = useChat(groupId || '');

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage(content);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    // This will be handled by the ChatWindow component
    console.log('Emoji selected:', emoji);
  };

  if (!groupId) {
    return <div className="text-red-500 text-center p-4">Error: Group ID is missing.</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <ChatLayoutProvider onEmojiSelect={handleEmojiSelect}>
      <ChatWindow groupId={groupId} />
    </ChatLayoutProvider>
  );
}
