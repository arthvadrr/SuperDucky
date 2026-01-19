import sprites, { notifySpriteChange } from '@/stores/sprites.ts';
import messages from '@/stores/messages.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import { getRandomSpriteSize, getSpriteSpeed } from '@/util/helpers.ts';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';
import { EXPIRATION_DURATION, MEGA_SPRITE_SIZE, MEGA_SPRITE_CHANCE } from '@/util/constants.ts';
import { socket } from '@/socket.ts';
import type { Message } from '@/stores/messages.ts';

type IncomingMessagePayload = {
  displayName?: string;
  messageText?: string;
  username?: string;
  fromUser?: string;
  message?: string;
  content?: string;
  command?: string;
  color?: string;
  user?: string;
  from?: string;
  text?: string;
};

function toKey(name: string): string {
  return name.toLowerCase();
}

function getUsername(payload: IncomingMessagePayload): string | null {
  return (payload.username ??
    payload.user ??
    payload.displayName ??
    payload.fromUser ??
    payload.from ??
    null) as string | null;
}

function getMessageText(payload: IncomingMessagePayload): string | null {
  return (payload.messageText ?? payload.message ?? payload.text ?? payload.content ?? null) as
    | string
    | null;
}

function handleIncomingMessage(ctx: IncomingMessagePayload | null | undefined): void {
  const raw: IncomingMessagePayload = ctx ?? {};
  const username = getUsername(raw);
  const messageText = getMessageText(raw);

  if (!username || !messageText) {
    return;
  }

  const command = raw.command;
  const color = raw.color;

  // normalize key used for storing sprites
  const key = toKey(username);
  const displayName = username;

  let size: number = getRandomSpriteSize();
  let isMega = false;

  if (!sprites?.[key] && Math.random() < MEGA_SPRITE_CHANCE) {
    size = MEGA_SPRITE_SIZE;
    isMega = true;
  }

  const speed: number = getSpriteSpeed(size);

  const message: Message = {
    messageText: messageText,
    readingLength: getReadingLength(messageText),
  };

  /**
   * Create or update sprites (keyed by lowercase username)
   */
  if (!sprites?.[key]) {
    const nameColor = color ?? getRandomHexColor();
    sprites[key] = {
      username: displayName,
      spriteKey: key,
      color: nameColor,
      messages: [message],
      state: {
        key: 'walk',
        isPausedTimeout: null,
        isPausedDuration: 0,
        isShowingMessageTimeout: null,
        isShowingMessage: false,
        isRunning: false,
        expiration: Date.now() + EXPIRATION_DURATION,
      },
      size: size,
      speed: speed,
      position: { x: 0, y: 0 },
      deltaX: 1,
      animation: null,
    };

    // also append to global messages history
    if (messages.length > 50) {
      messages.shift();
    }
    messages.push(message);

    notifySpriteChange();

    if (isMega) {
      socket.emit('megaDucky', { username: displayName });
    }
  } else {
    const currentMessages = sprites[key].messages;

    /**
     * Update the expiration time for inactivity
     */
    sprites[key].state.expiration = Date.now() + EXPIRATION_DURATION;

    /**
     * Push the message into history
     */
    const lastMsg =
      currentMessages && currentMessages.length > 0
        ? currentMessages[currentMessages.length - 1]!.messageText
        : null;

    if (messageText !== lastMsg) {
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
      sprites[key].messages.push(message);
      notifySpriteChange();
    }

    /**
     * User is updating their color, change it!
     */
    if (command === 'color' && color) {
      sprites[key].color = color;
      notifySpriteChange();
    }

    // keep display name in sync (case may vary per event)
    sprites[key].username = displayName;
  }
}

const MESSAGE_EVENTS = [
  'message',
  'bot_message',
  'botMessage',
  'assistant_message',
  'assistantMessage',
  'approved_message',
  'moderation_approved',
] as const;

MESSAGE_EVENTS.forEach((eventName) => {
  socket.on(eventName, handleIncomingMessage);
});
