import { initializeSocketServer } from './socket';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import type { Express, Response } from 'express';
import type { Server } from 'http';

dotenv.config({ path: path.resolve(__dirname, '../../.env-local') });

export function startServer(): void {
  const app: Express = express();
  const host: string = process.env.HOST || 'localhost';
  const port: number = Number(process.env.PORT) || 3050;

  app.get('/', (_: unknown, res: Response): void => {
    res.send('SuperDucky is running!');
  });

  const httpServer: Server = app.listen(port, () =>
    console.log(`Server running on http://${host}:${port}`),
  );

  initializeSocketServer(httpServer);
}
