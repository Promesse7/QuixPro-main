import { useState, useEffect } from 'react';
import { User, getCurrentUser } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  return { user };
};
