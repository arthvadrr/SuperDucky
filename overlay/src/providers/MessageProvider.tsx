import {
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { MessageContext } from '../context/MessageContext';
import { UserContext, type UserInstance } from '../context/UserContext';
import type { MessageInstance } from '../context/MessageContext';
import socket from '../socket';

/**
 * Create the provider
 */
export function MessageProvider({ children }: { children: ReactNode }) {
  const { users, setUsers } = useContext(UserContext);
  const [userMessages, setUserMessages] = useState<MessageInstance[]>([]);

  const addMessage = useCallback(
    (msg: MessageInstance) => {
      const { username, color } = msg;

      if (
        username &&
        !users.some((user: UserInstance) => user.username === username)
      ) {
        setUsers((prev) => [...prev, { username, color }]);
      }

      setUserMessages((prev) => {
        if (prev.length >= 30) {
          return [...prev.slice(1), msg];
        }
        return [...prev, msg];
      });
    },
    [users],
  );

  useEffect(() => {
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
