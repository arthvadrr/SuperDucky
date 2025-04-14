import { createContext } from 'react';
import type { SpriteInstance } from '../components/Sprite/SpriteController';

export type Sprites = Record<string, SpriteInstance>;

export interface SpriteContextType {
  sprites: Sprites;
  setSprites: React.Dispatch<React.SetStateAction<Sprites>>;
}

/**
 * Create the context
 */
export const SpriteContext = createContext<SpriteContextType>({
  sprites: {},
  setSprites: () => {
    throw new Error('setSprites called outside of SpriteContext.Provider');
  },
});
