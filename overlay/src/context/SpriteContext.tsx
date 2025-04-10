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

/**
 * The provider wrapper
 */
export function SpriteProvider({ children }: { children: ReactNode }) {
  const messages = useContext(MessageContext);
  const [sprites, setSprites] = useState<Sprites>({
    arthvadrr: {
      assets: {
        idle: '/images/super-ducky-transparent.webp',
        walk: '/animations/ducky-walking.webp',
        talk: '/animations/ducky-talking.webp',
      },
      state: 'walk',
      size: { x: 264, y: 264 },
      position: { x: 0, y: 0 },
    },
  });

  useEffect(() => {
    const updatedSprites = { ...sprites };

    messages?.userMessages.forEach((message: MessageInstance) => {
      const { username, command } = message;

      if (
        updatedSprites?.[username] &&
        (command === 'idle' || command === 'walk' || command === 'talk')
      ) {
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
