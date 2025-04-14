import { startServer } from './server';
import { startDucky } from './bot';

function main(): void {
  console.log('Starting Super Ducky');

  startServer();
  void startDucky();
}

main();
