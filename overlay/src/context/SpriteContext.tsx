import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { UserContext, type UserInstance } from '../context/UserContext';
import type { SpriteInstance } from '../components/Sprite/SpriteController';

export type Sprites = Record<string, SpriteInstance>;

export interface SpriteContextType {
  sprites: Sprites;
  setSprites: React.Dispatch<React.SetStateAction<Sprites>>;
}

/**
 * Create the context
 */
export const SpriteContext = createContext<SpriteContextType | undefined>(
  undefined,
);

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

const spritesInit: Sprites = {
  arthvadrr: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: { x: 100, y: 100 },
    position: { x: 0, y: 0 },
    color: '#FF0000',
  },
  anotherUser: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: { x: 100, y: 100 },
    position: { x: 0, y: 0 },
    color: '#06FA09',
  },
  loser: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: { x: 100, y: 100 },
    position: { x: 0, y: 0 },
    color: '#846401',
  },
  bigs: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: { x: 100, y: 100 },
    position: { x: 0, y: 0 },
    color: '#FA67B0',
  },
};

/**
 * The provider wrapper
 */
export function SpriteProvider({ children }: { children: ReactNode }) {
  const { users } = useContext(UserContext);
  const [sprites, setSprites] = useState<Sprites>(spritesInit);

  useEffect(() => {
    if (Array.isArray(users)) {
      const updatedSprites = { ...sprites };

      users.forEach(({ username, color }: UserInstance) => {
        if (!sprites?.[username]) {
          updatedSprites[username] = {
            assets: {
              idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
              walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
              talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
            },
            state: 'walk',
            size: { x: 100, y: 100 },
            position: { x: 0, y: 0 },
            color: color ?? '',
          };
        }
      });

      setSprites(updatedSprites);
    }
  }, [users]);

  return (
    <SpriteContext.Provider value={{ sprites, setSprites }}>
      {children}
    </SpriteContext.Provider>
  );
}
