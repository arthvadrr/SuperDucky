import { reactive } from 'vue';
import type SpriteAnimation from "@/classes/SpriteAnimation.ts";
import { getHueRotateAmount } from '@/util/getHueRotateAmount.ts';
import { getRandomHexColor } from '@/util/getRandomHexColor.ts';

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
  isPausedTimeout: any | null;
  isPausedDuration: number;
  isShowingMessageTimeout: any | null;
  isShowingMessage: boolean;
}

export interface Sprite {
  username: string;
  color: string;
  hueRotate: number;
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
  let result: Sprites = {};

  for (let i: number = 0; i < count; i++) {
    const username: string = `mockuser${i}`;

    result[username] = {
      username,
      color: getRandomHexColor(),
      hueRotate: getHueRotateAmount(getRandomHexColor()),
      messages: [],
      assets: {
        idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
        walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
        talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
      },
      state: {
        key: 'walk',
        isPausedTimeout: null,
        isPausedDuration: 0,
        isShowingMessageTimeout: null,
        isShowingMessage: false,
      },
      speed: Math.random() * (0.5 - 0.1) + 0.1,
      size: Math.random() * (100 - 50) + 50,
      position: { x: 0, y: 0 },
      deltaX: 1,
      animation: null,
    };
  }

  return result;
}

/**
 * Create the reactive store
 * Use ref to allow replacing the whole object if needed
 */
export const sprites: Sprites = reactive(initMockSprites(5) as Sprites);

export default sprites;
