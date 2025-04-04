import { useState } from 'react';
import Sprite, { SpriteState } from './Sprite';

export interface SpriteInstance {
  id: string;
  states: SpriteState;
  size: { x: number; y: number };
  position: { x: number; y: number };
  action: 'idle' | 'walking' | 'talking';
}

const initialSprites: SpriteInstance[] = [
  {
    id: 'ducky',
    states: {
      idle: '/images/super-ducky-transparent.webp',
      walking: '/animations/ducky-walking.webp',
      talking: '/animations/ducky-talking.webp',
    },
    size: { x: 264, y: 264 },
    position: { x: 0, y: 0 },
    action: 'walking',
  },
];

export default function SpriteController() {
  const [sprites, _] = useState<SpriteInstance[]>(initialSprites);

  return (
    <>
      {sprites.map((sprite) => (
        <Sprite
          key={sprite.id}
          states={sprite.states}
          size={sprite.size}
          position={sprite.position}
          action={sprite.action}
        />
      ))}
    </>
  );
}
