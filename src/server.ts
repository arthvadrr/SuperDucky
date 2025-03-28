import express from 'express';
import type { Express } from 'express';
import type { Response } from 'express';

export function startServer(): void {
	const app: Express = express();

	app.get('/', (_: unknown, res: Response): void => {
		res.send('SuperDucky is running!');
	});

	app.listen(3000, () =>
		console.log('Server running on http://localhost:3000')
	);
}
