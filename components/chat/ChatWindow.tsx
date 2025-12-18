// components/chat/ChatWindow.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import MathInput from '@/components/math/MathInput';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface ChatWindowProps {
  groupId: string;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ groupId, className = '' }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMathMode, setIsMathMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const _sessionHook = useSession();
  const session = _sessionHook?.data;
  const userId = session?.user?.email;
  
  const {
    messages,
    isTyping: typingUsers,
    sendMessage,
    setTyping,
  } = useChat(groupId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // If math mode is enabled, send as text with math metadata
    if (isMathMode) {
      sendMessage(message, 'math', { latex: message });
    } else {
      sendMessage(message);
    }
    setMessage('');
    setTyping(false);
  };

  const handleKeyDown = () => {
    if (!isTyping) {
      setTyping(true);
      setIsTyping(true);
    }
  };

  const handleKeyUp = () => {
    if (isTyping) {
      // Reset typing indicator after 2 seconds of inactivity
      setTimeout(() => {
        setTyping(false);
        setIsTyping(false);
      }, 2000);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get typing indicator text
  const getTypingText = () => {
    const typingUserIds = Object.entries(typingUsers)
      .filter(([_, isTyping]) => isTyping)
      .map(([userId]) => userId);

    if (typingUserIds.length === 0) return null;
    if (typingUserIds.length === 1) return 'is typing...';
    if (typingUserIds.length < 4) return 'are typing...';
    return 'Several people are typing...';
  };

  // Small helper to render LaTeX using KaTeX if available
  const MathPreview: React.FC<{ latex: string }> = ({ latex }) => {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const katex = await import('katex');
          if (!mounted) return;
          const rendered = katex.renderToString(latex || '', { throwOnError: false });
          setHtml(rendered);
        } catch (err) {
          setHtml(null);
        }
      })();
      return () => { mounted = false };
    }, [latex]);

    if (html) return <div dangerouslySetInnerHTML={{ __html: html }} />;
    return <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{latex}</pre>;
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Say hello!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] space-x-2 ${
                    msg.senderId === userId ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender?.image} alt={msg.sender?.name} />
                    <AvatarFallback>
                      {msg.sender?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      msg.senderId === userId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg?.type === 'math' ? (
                      <MathPreview latex={msg.content} />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        msg.senderId === userId ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground mb-2 h-4">
          {getTypingText()}
        </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1">
              {isMathMode ? (
                <MathInput
                  value={message}
                  onChange={(val) => setMessage(val || '')}
                />
              ) : (
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  placeholder="Type a message..."
                  className="flex-1"
                />
              )}
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <Button type="submit" size="icon">
                <Icons.send className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" onClick={() => setIsMathMode((s) => !s)} title={isMathMode ? 'Switch to text' : 'Switch to math'}>
                <span className="text-sm">Σ</span>
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
};