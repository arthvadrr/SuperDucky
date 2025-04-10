import Sprite, { SpriteStateAssets } from './Sprite';
import { useSprites } from '../../context/SpriteContext';

export interface SpriteInstance {
  assets: SpriteStateAssets;
  state: 'idle' | 'walk' | 'talk';
  size: { x: number; y: number };
  position: { x: number; y: number };
}

export default function SpriteController() {
  const { sprites } = useSprites();

  return (
    <>
      {Object.entries(sprites).map(([key, sprite]) => (
        <Sprite
          key={`sprite-${key}`}
          assets={sprite.assets}
          size={sprite.size}
          position={sprite.position}
          state={sprite.state}
        />
      ))}
    </>
  );
}
