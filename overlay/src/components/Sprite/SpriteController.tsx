import { useContext } from 'react';
import { SpriteContext } from '../../context/SpriteContext';
import Sprite from './Sprite';
import type { SpriteStateAssets } from './Sprite';

export interface SpriteInstance {
  assets: SpriteStateAssets;
  state: 'idle' | 'walk' | 'talk';
  position: { x: number; y: number };
  message: string;
  size: number;
  speed: number;
  color: string;
}

export default function SpriteController() {
  const { sprites } = useContext(SpriteContext);

  return (
    <>
      {Object.entries(sprites).map(([key, sprite]) => {
        return (
          <Sprite
            key={`sprite-${key}`}
            assets={sprite.assets}
            size={sprite.size}
            speed={sprite.speed}
            position={sprite.position}
            state={sprite.state}
            color={sprite.color}
            username={String(key)}
            message={sprite.message}
          />
        );
      })}
    </>
  );
}
