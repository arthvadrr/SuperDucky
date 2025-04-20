import { createContext, SetStateAction, Dispatch } from 'react';

/**
 * Interfaces
 */
export interface UserInstance {
  username: string;
  color?: string;
  messageText?: string;
}

export type Users = Record<string, UserInstance>;

export interface UserContext {
  users: Users;
  setUsers: Dispatch<SetStateAction<Users>>;
}

/**
 * Create the context
 */
export const UserContext = createContext<UserContext>({
  users: {},
  setUsers: () => {},
});
