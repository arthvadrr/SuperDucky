import { createContext } from 'react';

/**
 * Interfaces
 */
export interface MessageInstance {
  id: string;
  username: string;
  message: string;
}

export interface MessageContextType {
  messages: MessageInstance[];
  addMessage: (msg: MessageInstance) => void;
}

/**
 * Create the context
 */
export const MessageContext = createContext<MessageContextType | undefined>(
  undefined,
);
