import sprites from '@/stores/sprites.ts';
import { socket } from '@/socket.ts';

/**
 * Purge sprites that are inactive
 */
socket.on('purge', (): void => {
  const currentDate: number = Date.now();

  for (const sprite in sprites) {
    if (sprites[sprite] && currentDate > sprites[sprite].state.expiration) {
      delete sprites[sprite];
    }
  }
});
