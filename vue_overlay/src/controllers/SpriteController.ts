import sprites, { notifySpriteChange } from '@/stores/sprites.ts';
import { socket } from '@/socket.ts';

socket.on('purge', (): void => {
  const currentDate: number = Date.now();
  let changed = false;

  for (const sprite in sprites) {
    if (sprites[sprite] && currentDate > sprites[sprite].state.expiration) {
      delete sprites[sprite];
      changed = true;
    }
  }

  if (changed) notifySpriteChange();
});
