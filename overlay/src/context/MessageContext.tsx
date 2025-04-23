import { createContext } from 'react';

/**
 * Interfaces
 */
export interface MessageInstance {
  username: string;
  command: string;
  messageText: string;
  color: string;
}

export interface MessageContextType {
  userMessages: MessageInstance[];
  addMessage: (msg: MessageInstance) => void;
}

/**
 * Create the context
 */
export const MessageContext = createContext<MessageContextType>({
  userMessages: [],
  addMessage: () => {},
});
