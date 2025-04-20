import { useState, ReactNode } from 'react';
import { UserContext, type Users } from '../context/UserContext';

/**
 * Create the provider
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Users>({});

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
}
