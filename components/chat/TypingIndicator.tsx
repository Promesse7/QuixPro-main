import React from 'react';

interface TypingIndicatorProps {
  typingUsers: string[] | Record<string, boolean>;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  // Handle both array and object formats
  let typingUsersArray: string[] = [];
  
  if (Array.isArray(typingUsers)) {
    typingUsersArray = typingUsers;
  } else if (typeof typingUsers === 'object' && typingUsers !== null) {
    // Convert object keys to array (format: { userEmail: true })
    typingUsersArray = Object.keys(typingUsers);
  }
  
  if (typingUsersArray.length === 0) {
    return null;
  }

  return (
    <div className="text-sm text-gray-500 italic">
      {typingUsersArray.join(', ')} is typing...
    </div>
  );
};

export default TypingIndicator;
