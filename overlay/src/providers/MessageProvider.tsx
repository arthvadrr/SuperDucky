import { useState, ReactNode, useEffect, useContext, useMemo } from 'react';
import { MessageContext } from '../context/MessageContext';
import { UserContext, type Users } from '../context/UserContext';
import socket from '../socket';
import type { MessageInstance } from '../context/MessageContext';

/**
 * Create the provider
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const { users, setUsers } = useContext<UserContext>(UserContext);
  const [userMessages, setUserMessages] = useState<MessageInstance[]>([]);

  function addMessage(msg: MessageInstance) {
    const { username, color, messageText } = msg;
    const usersCopy: Users = { ...users };
    const messages: string[] = usersCopy[username]?.messages ?? [];

    messages.push(messageText ?? '');

    usersCopy[username] = {
      username,
      color,
      messages,
    };

    setUsers(usersCopy);

    setUserMessages((prev: MessageInstance[]): MessageInstance[] => {
      if (prev.length >= 30) {
        return [...prev.slice(1), msg];
      }
      return [...prev, msg];
    });
  }

  useEffect((): () => void => {
    socket.on('message', addMessage);

    return () => {
      socket.off('message', addMessage);
    };
  }, [addMessage]);

  const messageContextValue = useMemo(
    () => ({ userMessages, addMessage }),
    [userMessages, addMessage],
  );

  return (
    <MessageContext.Provider value={messageContextValue}>
      {children}
    </MessageContext.Provider>
  );
}