import { reactive, ref } from 'vue';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';
import { getRandomSpriteSize, getSpriteSpeed } from '@/util/helpers.ts';
import { EXPIRATION_DURATION } from '@/util/constants.ts';
import type SpriteAnimation from '@/classes/SpriteAnimation.ts';
import type { Message } from '@/stores/messages.ts';

export type SpriteStateKey = 'idle' | 'walk' | 'talk';

export interface SpritePosition {
  x: number;
  y: number;
}

export interface SpriteState {
  key: SpriteStateKey;
  isPausedTimeout: number | null;
  isPausedDuration: number | null;
  isShowingMessageTimeout: number | null;
  isShowingMessage: boolean;
  isRunning: boolean;
  expiration: number;
}

export interface Sprite {
  username: string;
  spriteKey?: string;
  color: string;
  messages: Message[];
  state: SpriteState;
  speed: number;
  size: number;
  position: SpritePosition;
  deltaX: 1 | -1;
  animation: SpriteAnimation | null;
}

export type Sprites = Record<string, Sprite>;

export const spriteVersion = ref(0);

const BOT_KEY = 'super_ducky_bot';
const BOT_NAME = 'Super_Ducky_Bot';

function duckyEggCracksOpen(): void {
  if (sprites[BOT_KEY]) return;

  const size: number = getRandomSpriteSize();
  const speed: number = getSpriteSpeed(size);

  sprites[BOT_KEY] = {
    username: BOT_NAME,
    spriteKey: BOT_KEY,
    color: '#ffcc66',
    messages: [],
    state: {
      key: 'walk',
      isPausedTimeout: null,
      isPausedDuration: 0,
      isShowingMessageTimeout: null,
      isShowingMessage: false,
      isRunning: false,
      // effectively never expire
      expiration: Date.now() + 1000 * 60 * 60 * 24 * 365,
    },
    size: size,
    speed: speed,
    position: { x: 0, y: 0 },
    deltaX: 1,
    animation: null,
  };

  notifySpriteChange();
}

export function notifySpriteChange(): void {
  spriteVersion.value++;
}

/**
 * Utility to generate mock sprites for development
 */
export function initMockSprites(count: number = 5): Sprites {
  const result: Sprites = {};
  const size: number = getRandomSpriteSize();
  const speed: number = getSpriteSpeed(size);

  for (let i: number = 0; i < count; i++) {
    const username: string = `mockuser${i}`;

    result[username] = {
      username,
      color: getRandomHexColor(),
      messages: [],
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
  }

  return result;
}

/**
 * Utility to spawn mock sprites staggered over a duration
 */
export function spawnMockSpritesOverTime(count: number, durationMs: number = 5000): void {
  for (let i: number = 0; i < count; i++) {
    setTimeout(
      () => {
        const username: string = `mockuser_${Date.now()}_${i}`;
        const size: number = getRandomSpriteSize();
        const speed: number = getSpriteSpeed(size);

        sprites[username] = {
          username,
          color: getRandomHexColor(),
          messages: [],
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
      },
      (durationMs / count) * i,
    );
  }
}

/**
 * Create the reactive store, init with mock sprites for testing
 */
export const sprites: Sprites = reactive(initMockSprites(0) as Sprites);

/**
 * Spawn mock sprites over a duration
 */
//spawnMockSpritesOverTime(5, 10_000);

/**
 * Auto spawn Super Ducky Bot
 */
//duckyEggCracksOpen();

export default sprites;
