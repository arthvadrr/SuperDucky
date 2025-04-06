import Sprite, { SpriteState } from './Sprite';
import { useSprites } from '../../context/SpriteContext';

export interface SpriteInstance {
  id: string;
  states: SpriteState;
  size: { x: number; y: number };
  position: { x: number; y: number };
  action: 'idle' | 'walking' | 'talking';
}

export default function SpriteController() {
  const { sprites } = useSprites();

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
