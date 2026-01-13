'use client';

import { useParams } from 'next/navigation';
import { useChat } from '@/lib/hooks/useChat';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import TypingIndicator from '@/components/chat/TypingIndicator';

export default function ChatPage() {
  const params = useParams();
  const groupId = params ? (params.groupId as string) : null;

  const { messages, typingUsers, sendMessage, sendTypingNotification, error } = useChat(groupId || '');

  const handleSendMessage = (content: string) => {
    if (content.trim()) {
      sendMessage(content);
    }
  };

  const handleTypingChange = (isTyping: boolean) => {
    sendTypingNotification(isTyping);
  };

  if (!groupId) {
    return <div className="text-red-500 text-center p-4">Error: Group ID is missing.</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Group Chat</h1>
      </div>
      <div className="flex-grow bg-white border rounded-lg p-4 overflow-y-auto">
        <MessageList messages={messages} />
      </div>
      <div className="mt-4">
        <TypingIndicator typingUsers={typingUsers} />
        <MessageInput onSendMessage={handleSendMessage} onTyping={handleTypingChange} />
      </div>
    </div>
  );
}
