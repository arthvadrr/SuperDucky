import { useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { SpriteContext } from '../context/SpriteContext';
import { UserContext } from '../context/UserContext';
import { getRandomHexColor } from '../util/getRandomHexColor';
import {
  MessageContext,
  type MessageContextType,
} from '../context/MessageContext';
import type { SpriteInstance } from '../components/Sprite/SpriteController';

export type Sprites = Record<string, SpriteInstance>;

export interface SpriteContextType {
  sprites: Sprites;
  setSprites: React.Dispatch<React.SetStateAction<Sprites>>;
}

const adjectives = ['happy', 'bouncy', 'brave', 'fuzzy', 'silly'];
const nouns = ['duck', 'cat', 'pup', 'frog', 'bee'];

function generateUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

function generateSpriteInstance(spriteAssets: {
  idle: string;
  walk: string;
  talk: string;
}): SpriteInstance {
  return {
    assets: spriteAssets,
    state: 'walk',
    size: Math.random() * (100 - 50) + 50,
    speed: Math.random() * (2 - 0.5) + 0.5,
    position: { x: 0, y: 0 },
    color: getRandomHexColor(),
    messages: [],
  };
}

function generateSpritesInit(
  count: number,
  spriteAssets: { idle: string; walk: string; talk: string },
): Sprites {
  const result: Sprites = {};
  for (let i = 0; i < count; i++) {
    const name = generateUsername();
    result[name] = generateSpriteInstance(spriteAssets);
  }
  return result;
}

/**
 * 🦆 Rise duckies 🦆
 */
export function SpriteProvider({ children }: { children: ReactNode }) {
  const { userMessages } = useContext<MessageContextType>(MessageContext);
  const { users } = useContext<UserContext>(UserContext);

  const spriteAssets = useMemo(
    () => ({
      idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
      walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
      talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
    }),
    [],
  );

  const [sprites, setSprites] = useState<Sprites>(() =>
    /**
     * Assign fake users
     */
    generateSpritesInit(0, spriteAssets),
  );

  useEffect(() => {
    setSprites((prevSprites) => {
      const updated = { ...prevSprites };

      for (const username in users) {
        const { color, messages } = users[username];

        if (updated?.[username]) {
          updated[username].messages = messages;
        } else {
          updated[username] = {
            assets: spriteAssets,
            state: 'walk',
            size: Math.random() * (100 - 50) + 50,
            speed: Math.random() * (2 - 0.5) + 0.5,
            position: { x: 0, y: 0 },
            color: color ?? '',
            messages: messages,
          };
        }
      }

      return updated;
    });
  }, [users, spriteAssets, userMessages.length]);

  const spriteContextValue = useMemo(
    () => ({ sprites, setSprites }),
    [sprites],
  );

  return (
    <SpriteContext.Provider value={spriteContextValue}>
      {children}
    </SpriteContext.Provider>
  );
}
