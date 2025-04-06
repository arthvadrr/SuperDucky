import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { MessageContext } from './MessageContext';

/**
 * Interfaces
 */
export interface SpriteState {
  idle: string;
  walking: string;
  talking: string;
}

export interface SpriteInstance {
  id: string;
  states: SpriteState;
  size: { x: number; y: number };
  position: { x: number; y: number };
  action: 'idle' | 'walking' | 'talking';
}

export interface SpriteContextType {
  sprites: SpriteInstance[];
  setSprites: React.Dispatch<React.SetStateAction<SpriteInstance[]>>;
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
  const [sprites, setSprites] = useState<SpriteInstance[]>([
    {
      id: 'arthvadrr',
      states: {
        idle: '/images/super-ducky-transparent.webp',
        walking: '/animations/ducky-walking.webp',
        talking: '/animations/ducky-talking.webp',
      },
      size: { x: 264, y: 264 },
      position: { x: 0, y: 0 },
      action: 'walking',
    },
  ]);

  useEffect(() => {
    console.log('received:', messages);
  }, [messages]);

  return (
    <SpriteContext.Provider value={{ sprites, setSprites }}>
      {children}
    </SpriteContext.Provider>
  );
}
