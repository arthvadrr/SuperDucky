import sprites from '@/stores/sprites.ts';
import messages from '@/stores/messages.ts';
import { EXPIRATION_DURATION } from '@/util/constants.ts';
import { getRandomSpriteSize, getSpriteSpeed } from '@/util/helpers.ts';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';
import { socket } from '@/socket.ts';
import type { Sprite } from '@/stores/sprites.ts';

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
       * Store the message in the history
       */
      messages.push({
        messageText: messageText,
        username: username,
      });

      /**
       * Add the message to the sprite's history
       */
      sprites[username].messages.push(messageText);
    }

    /**
     * User is updating their color, change it!
     */
    if (command === 'color' && color) {
      sprites[username].color = color;
    }
  }
});
