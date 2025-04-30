import { reactive } from 'vue';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';
import { DUCKY_ASSETS } from '@/util/constants.ts';
import { getRandomSpriteSize, getRandomSpriteSpeed } from '@/util/helpers.ts';
import type SpriteAnimation from "@/classes/SpriteAnimation.ts";

/**
 * Types and interfaces
 */
export type SpriteStateKey = 'idle' | 'walk' | 'talk';

export interface SpritePosition {
  x: number;
  y: number;
}

export interface SpriteState {
  key: SpriteStateKey,
  isPausedTimeout: number | null;
  isPausedDuration: number | null;
  isShowingMessageTimeout: number | null;
  isShowingMessage: boolean;
}

export interface Sprite {
  username: string;
  color: string;
  messages: string[];
  assets: Record<SpriteStateKey, string>;
  state: SpriteState;
  speed: number;
  size: number;
  position: SpritePosition;
  deltaX: 1 | -1;
  animation: SpriteAnimation | null;
}

export type Sprites = Record<string, Sprite>;

/**
 * Utility to generate mock sprites for development
 */
export function initMockSprites(count: number = 5): Sprites {
  const result: Sprites = {};

  for (let i: number = 0; i < count; i++) {
    const username: string = `mockuser${i}`;

    result[username] = {
      username,
      color: getRandomHexColor(),
      messages: [],
      assets: DUCKY_ASSETS,
      state: {
        key: 'walk',
        isPausedTimeout: null,
        isPausedDuration: 0,
        isShowingMessageTimeout: null,
        isShowingMessage: false,
      },
      speed: getRandomSpriteSpeed(),
      size: getRandomSpriteSize(),
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
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const username = `mockuser_${Date.now()}_${i}`;

      sprites[username] = {
        username,
        color: getRandomHexColor(),
        messages: [],
        assets: DUCKY_ASSETS,
        state: {
          key: 'walk',
          isPausedTimeout: null,
          isPausedDuration: 0,
          isShowingMessageTimeout: null,
          isShowingMessage: false,
        },
        speed: getRandomSpriteSpeed(),
        size: getRandomSpriteSize(),
        position: { x: 0, y: 0 },
        deltaX: 1,
        animation: null,
      };
    }, (durationMs / count) * i);
  }
}

/**
 * Create the reactive store
 * Use ref to allow replacing the whole object if needed
 */
export const sprites: Sprites = reactive(initMockSprites(0) as Sprites);

spawnMockSpritesOverTime(5, 400000);

export default sprites;
