import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let socketServer: Server;

export function initializeSocketServer(httpServer: HTTPServer): void {
	socketServer = new Server(httpServer, {
		cors: {
			origin: 'http://localhost:5173',
		},
	});

	socketServer.on('connection', socket => {
		console.log('🔌 Client connected:');

		socket.on('disconnect', () => {
			console.log('❌ Client disconnected:');
		});
	});
}

export function getSocketServer(): Server {
	return socketServer;
}
