import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import RenderedContent from './RenderedContent';
import { Message } from '@/models/Chat';

// Define the enriched message type that includes the full sender object
interface EnrichedMessage extends Omit<Message, 'senderId'> {
  sender: { id: string; name: string; avatar?: string };
}

interface MessageListProps {
  messages: EnrichedMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender?.id === user?.id;
        return (
          <div
            key={index}
            className={`flex items-end ${isCurrentUser ? 'justify-end' : ''}`}
          >
            {!isCurrentUser && (
              <img
                src={msg.sender?.avatar || 'https://i.pravatar.cc/300'}
                alt={msg.sender?.name || 'User'}
                className="w-8 h-8 rounded-full mr-3"
              />
            )}
            <div
              className={`rounded-lg px-4 py-2 ${
                isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {!isCurrentUser && (
                <p className="text-sm font-semibold">{msg.sender?.name}</p>
              )}
              <RenderedContent content={msg.content} />
              <p className="text-xs text-right opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
