import express from 'express';
import dotenv from 'dotenv';
import type { Express } from 'express';
import type { Response } from 'express';
import { initializeSocketServer } from './socket';

dotenv.config({ path: '.env-local' });

export function startServer(): void {
	const app: Express = express();
	const host = process.env.HOST || 'localhost';
	const port = process.env.PORT || 3050;

	app.get('/', (_: unknown, res: Response): void => {
		res.send('SuperDucky is running!');
	});

	const httpServer = app.listen(port, () =>
		console.log(`Server running on http://${host}:${port}`)
	);

	initializeSocketServer(httpServer);
}
