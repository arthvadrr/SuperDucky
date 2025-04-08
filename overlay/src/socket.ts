import { io } from 'socket.io-client';

const socket = io(
  `http://${import.meta.env.VITE_FRONTEND_HOST}:${import.meta.env.VITE_FRONTEND_PORT}`,
);

export default socket;
