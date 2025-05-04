import { io, type Socket } from 'socket.io-client';

/**
 * Connect to the socket server quack
 */
export const socket: Socket = io(
  `http://${import.meta.env.VITE_SERVER_HOST ?? 'localhost'}:${import.meta.env.VITE_SERVER_PORT ?? '3099'}`,
);
