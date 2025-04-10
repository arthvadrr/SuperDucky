import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import '../../styles/Sprite.scss';

/**
 * Types and interfaces
 */
export type SpriteStateKey = 'idle' | 'walk' | 'talk';

export interface SpriteStateAssets {
  idle: string;
  walk: string;
  talk: string;
}

export interface SpriteProps {
  assets: SpriteStateAssets;
  state?: SpriteStateKey;
  speed?: number;
  size: {
    x: number;
    y: number;
  };
  position?: {
    x: number;
    y: number;
  };
}

/**
 * FC Sprite
 */
export default function Sprite({
  assets,
  speed = 1,
  size,
  position = { x: 0, y: 0 },
  state = 'idle',
}: SpriteProps) {
  const spriteRef = useRef<HTMLImageElement>(null);
  const [posX, setPosX] = useState(position.x);
  const [deltaX, setDeltaX] = useState(1);
  const frameRef = useRef<number | null>(null);

  function animateWalk() {
    const sprite = spriteRef.current;

    if (sprite && sprite.parentElement) {
      const parentWidth = sprite.parentElement.clientWidth;
      const width = sprite.clientWidth;
      const newX = posX + deltaX * speed;

      if (newX <= 0 || newX + width >= parentWidth) {
        setDeltaX((prev) => -prev);
      } else {
        setPosX(newX);
      }

      frameRef.current = requestAnimationFrame(animateWalk);
    }
  }

  useEffect(() => {
    if (state === 'walk') {
      frameRef.current = requestAnimationFrame(animateWalk);
    }
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [state, posX, deltaX, speed]);

  const styleVars: CSSProperties = {
    '--width': `auto`,
    '--height': `${size.y}px`,
    '--left': `${posX}px`,
    '--bottom': `${position.y}px`,
    '--transform': deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)',
  } as CSSProperties;

  return (
    <img
      ref={spriteRef}
      src={assets[state]}
      className="sprite"
      style={styleVars}
    />
  );
}
