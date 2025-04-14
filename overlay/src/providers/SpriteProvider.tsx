import { useContext, useEffect, useState, ReactNode } from 'react';
import { SpriteContext } from '../context/SpriteContext';
import { UserContext, type UserInstance } from '../context/UserContext';
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
    position: { x: 0, y: 0 },
    color: '#FF0000',
  },
  SomeUser: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: Math.random() * (100 - 75) + 75,
    position: { x: 0, y: 0 },
    color: '#00FFaa',
  },
  loserBum: {
    assets: {
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    },
    state: 'walk',
    size: Math.random() * (100 - 75) + 75,
    position: { x: 0, y: 0 },
    color: '#aaaaFF',
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
      const updatedSprites: Sprites = { ...sprites };

      users.forEach(({ username, color }: UserInstance) => {
        if (!sprites?.[username]) {
          updatedSprites[String(username)] = {
            assets: {
              idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
              walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
              talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
            },
            state: 'walk',
            size: Math.random() * (100 - 50) + 50,
            position: { x: 0, y: 0 },
            color: color ?? '',
          };
        }
      });

      if (Object.keys(updatedSprites).length !== Object.keys(sprites).length) {
        setSprites(updatedSprites);
      }
    }
  }, [users, sprites]);

  return (
    <SpriteContext.Provider value={{ sprites, setSprites }}>
      {children}
    </SpriteContext.Provider>
  );
}
