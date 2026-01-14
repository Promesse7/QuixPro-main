import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MathInput } from '@/components/math/MathInput';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleValueChange = (latex: string) => {
    setInputValue(latex);
    if (!isTyping && latex.length > 0) {
      setIsTyping(true);
      onTyping(true);
    } else if (isTyping && latex.length === 0) {
      setIsTyping(false);
      onTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }
  };

  return (
    <div className="flex items-start space-x-2">
      <div className="flex-grow">
        <MathInput
          value={inputValue}
          onChange={handleValueChange}
          placeholder="Type a message or LaTeX..."
        />
      </div>
      <Button onClick={handleSendMessage} size="default">
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
