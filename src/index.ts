import { startServer } from './server';
import { startDucky } from './bot';

function main(): void {
	console.log('init!');

	startServer();
	void startDucky();
}

main();
