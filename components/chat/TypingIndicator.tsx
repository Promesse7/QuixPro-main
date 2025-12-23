import React from 'react';

interface TypingIndicatorProps {
  typingUsers: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (typingUsers.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-gray-500 italic">
      {typingUsers.join(', ')} is typing...
    </div>
  );
};

export default TypingIndicator;
