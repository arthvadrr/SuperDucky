import { reactive } from 'vue';

/**
 * Types and interfaces
 */
export enum SpriteStateKey {
  'walk',
  'idle',
  'talk',
}

export interface Position {
  x: number;
  y: number;
}

export interface Sprite {
  username: string;
  color: string;
  messages: string[];
  assets: string[];
  state: SpriteStateKey;
  speed: number;
  size: number;
  position: Position;
}

export type Sprites = Record<string, Sprite>;

/**
 * Create the reactive store
 * Use ref to allow replacing the whole object if needed
 */
export const sprites = reactive({} as Sprites);

export default sprites;
