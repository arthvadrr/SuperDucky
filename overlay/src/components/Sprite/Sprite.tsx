import { useState, useEffect, useRef } from 'react';
import type { CSSProperties, Dispatch, RefObject, SetStateAction } from 'react';
import '../../styles/Sprite.scss';

export type SpriteStateImgURL = string;
export type SpriteStateKey = 'idle' | 'walking' | 'talking';

export interface SpriteState {
  idle: SpriteStateImgURL;
  walking: SpriteStateImgURL;
  talking: SpriteStateImgURL;
}

export interface SpriteProps {
  states: SpriteState;
  speed?: number;
  size: {
    x: number;
    y: number;
  };
  position?: {
    x: number;
    y: number;
  };
  action?: SpriteStateKey;
  walkingEnabled?: boolean;
}

function animateWalking(
  spriteRef: RefObject<HTMLImageElement | null>,
  x: number,
  x_Delta: number,
  speed: number,
  setX: Dispatch<SetStateAction<number>>,
  set_x_Delta: Dispatch<SetStateAction<number>>,
  frameRef: RefObject<number | null>,
) {
  const sprite = spriteRef.current;

  if (sprite && sprite.parentElement) {
    const parentWidth = sprite.parentElement.clientWidth;
    const width = sprite.clientWidth;
    const newX = x + x_Delta * speed;

    if (newX <= 0 || newX + width >= parentWidth) {
      set_x_Delta((prev) => -prev);
    } else {
      setX(newX);
    }

    frameRef.current = requestAnimationFrame(() =>
      animateWalking(
        spriteRef,
        newX,
        x_Delta,
        speed,
        setX,
        set_x_Delta,
        frameRef,
      ),
    );
  }
}

export default function Sprite({
  states,
  speed = 1,
  size,
  position = { x: 0, y: 0 },
  action = 'idle',
}: SpriteProps) {
  const [currentAction, _] = useState<SpriteStateKey>(action);
  const spriteRef = useRef<HTMLImageElement>(null);
  const [x, setX] = useState(position.x);
  const [x_Delta, set_x_Delta] = useState(1);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentAction === 'walking') {
      animationFrameRef.current = requestAnimationFrame(() =>
        animateWalking(
          spriteRef,
          x,
          x_Delta,
          speed,
          setX,
          set_x_Delta,
          animationFrameRef,
        ),
      );
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentAction, x, x_Delta, speed, size.x]);

  const styleVars: CSSProperties = {
    '--width': `auto`,
    '--height': `${size.y}px`,
    '--left': `${x}px`,
    '--bottom': `${position.y}px`,
    '--transform': x_Delta < 0 ? 'scaleX(-1)' : 'scaleX(1)',
  } as CSSProperties;

  return (
    <img
      ref={spriteRef}
      src={states[currentAction]}
      className="sprite"
      style={styleVars}
    />
  );
}
