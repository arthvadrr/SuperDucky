import { Server } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import type { Server as HTTPServer } from 'http';

dotenv.config({ path: path.resolve(__dirname, '../../.env.shared.local') });

let socketServer: Server;

export function initializeSocketServer(httpServer: HTTPServer): void {
  const fesocket = `http://${process.env.VITE_FRONTEND_HOST ?? 'localhost'}:${process.env.VITE_FRONTEND_PORT ?? '3000'}`;

  console.log('SOCKETFE', fesocket);

  socketServer = new Server(httpServer, {
    cors: {
      origin: `http://${process.env.VITE_FRONTEND_HOST ?? 'localhost'}:${process.env.VITE_FRONTEND_PORT ?? '3000'}`,
    },
  });

  socketServer.on('connection', (socket) => {
    console.log('🔌 Client connected:');

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:');
    });
  });
}

export function getSocketServer(): Server {
  return socketServer;
}
