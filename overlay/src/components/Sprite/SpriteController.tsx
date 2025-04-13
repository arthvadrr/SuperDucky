import { useContext } from 'react';
import Sprite, { SpriteStateAssets } from './Sprite';
import { SpriteContext } from '../../context/SpriteContext';

export interface SpriteInstance {
  assets: SpriteStateAssets;
  state: 'idle' | 'walk' | 'talk';
  size: number;
  position: { x: number; y: number };
  speed: number;
  color: string;
}

export default function SpriteController() {
  const { sprites } = useContext(SpriteContext);

  return (
    <>
      {Object.entries(sprites).map(([key, sprite]) => (
        <Sprite
          key={`sprite-${key}`}
          assets={sprite.assets}
          size={sprite.size}
          position={sprite.position}
          speed={sprite.speed}
          state={sprite.state}
          color={sprite.color}
          username={String(key)}
        />
      ))}
    </>
  );
}
