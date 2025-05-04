import sprites from '@/stores/sprites.ts';
import messages from '@/stores/messages.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import { getRandomSpriteSize, getSpriteSpeed } from '@/util/helpers.ts';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';
import { EXPIRATION_DURATION } from '@/util/constants.ts';
import { socket } from '@/socket.ts';
import type { Message } from '@/stores/messages.ts';
import type { Sprite } from '@/stores/sprites.ts';

/**
 * Listen for messages
 */
socket.on('message', (ctx): void => {
  const { username, messageText, command, color } = ctx;

  const size: number = getRandomSpriteSize();
  const speed: number = getSpriteSpeed(size);

  const message: Message = {
    messageText: messageText,
    readingLength: getReadingLength(messageText),
  };

  /**
   * Create or update sprites
   */
  if (!sprites?.[username]) {
    const nameColor = color ?? getRandomHexColor();
    sprites[username] = {
      username: username,
      color: nameColor,
      messages: [message],
      state: {
        key: 'walk',
        isPausedTimeout: null,
        isPausedDuration: 0,
        isShowingMessageTimeout: null,
        isShowingMessage: false,
        expiration: Date.now() + EXPIRATION_DURATION,
      },
      size: size,
      speed: speed,
      position: { x: 0, y: 0 },
      deltaX: 1,
      animation: null,
    };
  } else {
    const { messages: currentMessages }: Partial<Sprite> = sprites[username];

    /**
     * Update the expiration time for inactivity
     */
    sprites[username].state.expiration = Date.now() + EXPIRATION_DURATION;

    /**
     * Push the message into history
     */
    if (messageText !== currentMessages[currentMessages.length - 1]) {
      /**
       * Keep a maximum of 50 messages in history
       */
      if (messages.length > 50) {
        messages.shift();
      }

      /**
       * Store the message in both message and sprite history
       */
      messages.push(message);
      sprites[username].messages.push(message);
    }

    /**
     * User is updating their color, change it!
     */
    if (command === 'color' && color) {
      sprites[username].color = color;
    }
  }
});
