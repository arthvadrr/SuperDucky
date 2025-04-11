import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { MessageContext, MessageInstance } from './MessageContext';
import type { SpriteInstance } from '../components/Sprite/SpriteController';

export type Sprites = Record<string, SpriteInstance>;

export interface SpriteContextType {
  sprites: Sprites;
  setSprites: React.Dispatch<React.SetStateAction<Sprites>>;
}

/**
 * Create the context
 */
const SpriteContext = createContext<SpriteContextType | undefined>(undefined);

/**
 * The context hook
 */
export function useSprites() {
  const context = useContext(SpriteContext);

  if (!context) {
    throw new Error('Missing SpriteProvider wrapper/provider');
  }

  return context;
}

const spritesInit = {
  arthvadrr: {
    assets: {
      idle: '/images/super-ducky-transparent.webp',
      walk: '/animations/ducky-walking.webp',
      talk: '/animations/ducky-talking.webp',
    },
    state: 'walk',
    size: { x: 180, y: 180 },
    position: { x: 0, y: 0 },
  },
};

/**
 * The provider wrapper
 */
export function SpriteProvider({ children }: { children: ReactNode }) {
  const messages = useContext(MessageContext);
  const [sprites, setSprites] = useState<Sprites>({});

  useEffect(() => {
    const updatedSprites = { ...sprites };

    messages?.userMessages.forEach((message: MessageInstance) => {
      const { username, command } = message;

      if (!updatedSprites?.[username]) {
        updatedSprites[username] = {
          assets: {
            idle: '/animations/baby-ducky-idle.webp',
            walk: '/animations/baby-ducky-walk.webp',
            talk: '/animations/baby-ducky-talking.webp',
          },
          state: 'walk',
          size: { x: 100, y: 100 },
          position: { x: 0, y: 0 },
        };
      }

      if (command === 'idle' || command === 'walk' || command === 'talk') {
        updatedSprites[username].state = command;
      }
    });

    setSprites(updatedSprites);
  }, [messages]);

  return (
    <SpriteContext.Provider value={{ sprites, setSprites }}>
      {children}
    </SpriteContext.Provider>
  );
}
