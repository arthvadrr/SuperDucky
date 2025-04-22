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
      origin: [
        `http://${process.env.VITE_FRONTEND_HOST ?? 'localhost'}:${process.env.VITE_FRONTEND_PORT ?? '3000'}`,
        `http://${process.env.VITE_FRONTEND_HOST ?? 'localhost'}:${process.env.VITE_VUE_OVERLAY_PORT ?? '3000'}`
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  socketServer.on('connection', (socket) => {
    console.log('🔌 Client connected:');

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