import { useState, ReactNode, useEffect, useCallback } from 'react';
import { MessageContext } from '../context/MessageContext';
import type { MessageInstance } from '../context/MessageContext';
import socket from '../socket';

/**
 * Create the provider
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<MessageInstance[]>([]);

  console.log('msv OUTSIDEUE msg:', messages);

  const addMessage = useCallback((msg: MessageInstance) => {
    console.log('addmessage msg:', msg);

    setMessages((prev) => {
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
    (message: MessageInstance) => {
      console.log('listened, received message! (onReceiveMessage)');
      addMessage(message);
    },
    [addMessage],
  );

  /**
   * Listen for messages
   */
  useEffect(() => {
    console.log('listened, received message! (useEffect)');
    socket.on('message', onReceiveMessage);

    return () => {
      socket.off('message', onReceiveMessage);
    };
  }, [onReceiveMessage]);

  useEffect(() => {
    console.log('New message received, current messages:', messages);
  }, [messages]);

  return (
    <MessageContext.Provider value={{ messages, addMessage }}>
      {children}
    </MessageContext.Provider>
  );
}
