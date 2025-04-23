import { reactive } from 'vue';

/**
 * Types and interfaces
 */
export type SpriteStateKey = 'idle' | 'walk' | 'talk';

export interface Sprite {
  username: string;
  color: string;
  messages: string[];
  assets: SpriteStateAssets;
  state: SpriteStateKey;
  speed: number;
  size: number;
  position: {
    x: number;
    y: number;
  };
}

export type Sprites = Record<string, Sprite>;

export interface SpriteStateAssets {
  idle: string;
  walk: string;
  talk: string;
}

/**
 * Create the reactive store
 */
export const sprites: Sprites = reactive({});

export default sprites;
