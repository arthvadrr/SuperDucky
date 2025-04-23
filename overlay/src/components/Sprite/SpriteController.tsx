import { useContext, memo } from 'react';
import { SpriteContext } from '../../context/SpriteContext';
import Sprite from './Sprite';
import type { SpriteStateAssets } from './Sprite';

export interface SpriteInstance {
  assets: SpriteStateAssets;
  state: 'idle' | 'walk' | 'talk';
  position: { x: number; y: number };
  messages: string[];
  size: number;
  speed: number;
  color: string;
}

function SpriteController() {
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
            messages={sprite.messages}
          />
        );
      })}
    </>
  );
}
export default memo(SpriteController);
