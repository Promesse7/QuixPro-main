import React from 'react';
import { getCurrentUserId } from '@/lib/userUtils';

// Define the message type for Firebase-native format
interface FirebaseMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  senderEmail?: string;
  senderName?: string;
  content: string;
  type: string;
  createdAt: string | number;
  read: boolean;
}

interface MessageListProps {
  messages: FirebaseMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const currentUserId = getCurrentUserId();

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        
        return (
          <div
            key={message._id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                isCurrentUser
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-muted rounded-tl-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {message.createdAt && !isNaN(new Date(message.createdAt).getTime())
                    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--'}
                </p>
                {isCurrentUser && (
                  <span className="text-[10px]">
                    {message.read ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
