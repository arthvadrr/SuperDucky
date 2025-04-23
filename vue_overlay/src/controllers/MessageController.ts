import sprites from '@/stores/sprites.ts';
import messages from '@/stores/messages.ts';
import { io, Socket } from 'socket.io-client';
import type { Sprite } from '@/stores/sprites.ts';

/**
 * Connect to the socket server quack
 */
const socket: Socket = io(
  `http://${import.meta.env.VITE_SERVER_HOST ?? 'localhost'}:${import.meta.env.VITE_SERVER_PORT ?? '3099'}`,
);

/**
 * Static asset paths
 */
const spriteAssets: Record<'idle' | 'walk' | 'talk', string> = {
  idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
  walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
  talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
}

/**
 * Listen for messages
 */
socket.on('message', (ctx): void => {
  const { username, messageText, color } = ctx;

  /**
   * Create or update sprites
   */
  if (!sprites?.[username]) {
    sprites[username] = {
      username: username,
      color: color,
      messages: [messageText],
      assets: spriteAssets,
      state: 'walk',
      size: Math.random() * (100 - 50) + 50,
      speed: Math.random() * (2 - 0.5) + 0.5,
      position: { x: 0, y: 0 },
    }
  } else {
    const {
      color: currentColor,
      messages: currentMessages
    }: Partial<Sprite> = sprites[username];

    if (color !== currentColor) {
      sprites[username].color = color;
    }

    if (messageText !== currentMessages[currentMessages.length - 1]) {
      sprites[username].messages.push(messageText);
    }
  }

  /**
   * Add messages to the state
   */
  if (messages.length > 50) {
    messages.shift();
  }

  messages.push({
    messageText: messageText,
    username: username,
  });
});
