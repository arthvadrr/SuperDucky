import router from './api/v1/router';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { initializeSocketServer } from './socket';
import type { Express, Response } from 'express';
import type { Server } from 'http';

dotenv.config({ path: path.resolve(__dirname, '../../.env.shared.local') });

export function startServer(): void {
  const app: Express = express();
  const host: string = process.env.VITE_SERVER_HOST || 'localhost';
  const port: number = Number(process.env.VITE_SERVER_PORT) ?? 3000;

  app.use('/api/v1', router);
  
  app.get('/', (_: unknown, res: Response): void => {
    res.send('SuperDucky is running!');
  });

  const httpServer: Server = app.listen(port, (): void =>
    console.log(`Server running on http://${host}:${port}`),
  );

  initializeSocketServer(httpServer);
}