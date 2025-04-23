import { useState } from 'react';
import { UserContext, type Users } from '../context/UserContext';
import type { ReactElement } from 'react';

/**
 * Create the provider
 */
export function UserProvider({ children }: { children: ReactElement }): ReactElement {
  const [users, setUsers] = useState<Users>({});

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
}