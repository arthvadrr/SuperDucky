import { createContext, SetStateAction, Dispatch } from 'react';

/**
 * Interfaces
 */
export interface UserInstance {
  username: string;
  color?: string;
  message?: string;
}

export interface UserContext {
  users: UserInstance[];
  setUsers: Dispatch<SetStateAction<UserInstance[]>>;
}

/**
 * Create the context
 */
export const UserContext = createContext<UserContext>({
  users: [],
  setUsers: () => {},
});
