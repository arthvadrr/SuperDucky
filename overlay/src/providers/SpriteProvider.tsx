import { useContext, useEffect, ReactNode } from 'react';
import { SpriteContext } from '../context/SpriteContext';
import { UserContext, type UserInstance } from '../context/UserContext';
import type { SpriteInstance } from '../components/Sprite/SpriteController';

export type Sprites = Record<string, SpriteInstance>;

export interface SpriteContextType {
  sprites: Sprites;
  setSprites: React.Dispatch<React.SetStateAction<Sprites>>;
}

/**
 * The provider wrapper
 */
export function SpriteProvider({ children }: { children: ReactNode }) {
  const { users } = useContext(UserContext);
  const { sprites, setSprites } = useContext(SpriteContext);

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
            size: Math.random() * (100 - 50) + 50,
            speed: Math.random() * (5 - 0.5) + 0.5,
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
