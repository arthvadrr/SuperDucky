import { useState, useEffect } from 'react';
import socket from '../socket';

export default function ChatMessage() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    function handleProjectMessage(msg: string) {
      setMessage(msg);
    }

    socket.on('projectMessage', handleProjectMessage);

    return () => {
      socket.off('projectMessage', handleProjectMessage);
    };
  }, []);

  return <div>{message}</div>;
}
