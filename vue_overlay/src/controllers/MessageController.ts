import sprites from '@/stores/sprites.ts';
import messages from '@/stores/messages.ts';
import { getRandomSpriteSize, getSpriteSpeed } from '@/util/helpers.ts';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';
import { io, type Socket } from 'socket.io-client';
import type { Sprite } from '@/stores/sprites.ts';

/**
 * Connect to the socket server quack
 */
const socket: Socket = io(
  `http://${import.meta.env.VITE_SERVER_HOST ?? 'localhost'}:${import.meta.env.VITE_SERVER_PORT ?? '3099'}`,
);

/**
 * Listen for messages
 */
socket.on('message', (ctx): void => {
  const { username, messageText, command, color } = ctx;

  const size: number = getRandomSpriteSize();
  const speed: number = getSpriteSpeed(size);

  /**
   * Create or update sprites
   */
  if (!sprites?.[username]) {
    const nameColor = color ?? getRandomHexColor();

    sprites[username] = {
      username: username,
      color: nameColor,
      messages: [messageText],
      state: {
        key: 'walk',
        isPausedTimeout: null,
        isPausedDuration: 0,
        isShowingMessageTimeout: null,
        isShowingMessage: false,
      },
      size: size,
      speed: speed,
      position: { x: 0, y: 0 },
      deltaX: 1,
      animation: null,
    };
  } else {
    const { messages: currentMessages }: Partial<Sprite> = sprites[username];

    if (messageText !== currentMessages[currentMessages.length - 1]) {
      sprites[username].messages.push(messageText);
    }

    if (command === 'color' && color) {
      sprites[username].color = color;
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
