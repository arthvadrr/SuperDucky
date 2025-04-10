import { useState, ReactNode, useEffect, useCallback } from 'react';
import { MessageContext } from '../context/MessageContext';
import type { MessageInstance } from '../context/MessageContext';
import socket from '../socket';

/**
 * Create the provider
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const [userMessages, setUserMessages] = useState<MessageInstance[]>([]);

  const addMessage = useCallback((msg: MessageInstance) => {
    setUserMessages((prev) => {
      if (prev.length >= 30) {
        return [...prev.slice(1), msg];
      }
      return [...prev, msg];
    });
  }, []);

  /**
   * Memoize our function reference for cleanup
   */
  const onReceiveMessage = useCallback(
    (message: MessageInstance) => addMessage(message),
    [addMessage],
  );

  /**
   * Listen for messages
   */
  useEffect(() => {
    socket.on('message', onReceiveMessage);

    return () => {
      socket.off('message', onReceiveMessage);
    };
  }, [onReceiveMessage]);

  return (
    <MessageContext.Provider value={{ userMessages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
}
