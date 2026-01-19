import { Server } from 'socket.io';
import { getAllTasks } from './db/tasks';
import path from 'path';
import dotenv from 'dotenv';
import type { Server as HTTPServer } from 'http';

dotenv.config({ path: path.resolve(__dirname, '../../.env.shared.local') });

let socketServer: Server;
let megaDuckyCallback: ((username: string) => void) | null = null;

export function setMegaDuckyCallback(callback: (username: string) => void): void {
  megaDuckyCallback = callback;
}

export function initializeSocketServer(httpServer: HTTPServer): void {
  socketServer = new Server(httpServer, {
    cors: {
      origin: [
        `http://${process.env.VITE_FRONTEND_HOST ?? 'localhost'}:${process.env.VITE_FRONTEND_PORT ?? '3000'}`,
        `http://${process.env.VITE_FRONTEND_HOST ?? 'localhost'}:${process.env.VITE_VUE_OVERLAY_PORT ?? '3000'}`,
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['polling', 'websocket'],
  });

  socketServer.on('connection', (socket) => {
    console.log('🔌 Client connected:');

    socket.on('tasks:request', () => {
      socket.emit('tasks:init', getAllTasks());
    });

    socket.on('megaDucky', (data: { username: string }) => {
      if (megaDuckyCallback) {
        megaDuckyCallback(data.username);
      }
    });

    socket.on('manual-disconnect', (reason: string) => {
      console.log(`👋 Client manually disconnected: ${reason}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${reason}`);
    });
  });
}

export function getSocketServer(): Server {
  return socketServer;
}

export function emitChatMessage(username: string, messageText: string): void {
  if (!socketServer) {
    return;
  }

  socketServer.emit('message', {
    username,
    messageText,
  });
}
