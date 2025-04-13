import { createContext } from 'react';
import type { SpriteInstance } from '../components/Sprite/SpriteController';

export type Sprites = Record<string, SpriteInstance>;

export interface SpriteContextType {
  sprites: Sprites;
  setSprites: React.Dispatch<React.SetStateAction<Sprites>>;
}

const spritesInit: Sprites = {
  arthvadrr: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: Math.random() * (100 - 75) + 75,
    speed: Math.random() * (3 - 0.5) + 0.5,
    position: { x: 0, y: 0 },
    color: '#FF0000',
  },
  ducky: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: Math.random() * (100 - 75) + 75,
    speed: Math.random() * (3 - 0.5) + 0.5,
    position: { x: 0, y: 0 },
    color: '#00FF00',
  },
  someuser: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: Math.random() * (100 - 75) + 75,
    speed: Math.random() * (3 - 0.5) + 0.5,
    position: { x: 0, y: 0 },
    color: '#0000FF',
  },
};

/**
 * Create the context
 */
export const SpriteContext = createContext<SpriteContextType>({
  sprites: spritesInit,
  setSprites: () => {},
});
