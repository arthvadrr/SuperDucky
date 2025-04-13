import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import '../../styles/Sprite.scss';
import { getHueRotateAmount } from '../../util/getHueRotateAmount';

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
  color?: string;
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
  color = '',
  speed = 1,
  size,
  position = { x: 0, y: 0 },
  state = 'walk',
}: SpriteProps) {
  const spriteRef = useRef<HTMLImageElement>(null);
  const [posX, setPosX] = useState(position.x);
  const [deltaX, setDeltaX] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const frameRef = useRef<number | null>(null);

  function animateWalk() {
    const sprite = spriteRef.current;

    if (isPaused) {
      return;
    }

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
    if (state === 'walk' && !isPaused) {
      frameRef.current = requestAnimationFrame(animateWalk);
    }
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [state, posX, deltaX, speed, isPaused]);

  useEffect(() => {
    if (state !== 'walk') return;

    let timerId: NodeJS.Timeout;

    if (!isPaused) {
      const pauseAfter = Math.random() * 4000 + 1000;
      timerId = setTimeout(() => {
        setIsPaused(true);
      }, pauseAfter);
    } else {
      const resumeAfter = Math.random() * 4000 + 1000;
      timerId = setTimeout(() => {
        setIsPaused(false);
      }, resumeAfter);
    }

    return () => clearTimeout(timerId);
  }, [state, isPaused]);

  const styleVars: CSSProperties = {
    '--width': `${size.x}px`,
    '--height': `${size.y}px`,
    '--left': `${posX}px`,
    '--bottom': `${position.y}px`,
    '--color': color,
    '--transform': deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)',
    '--backgroundImage': `url(${state === 'walk' && isPaused ? assets.idle : assets[state]})`,
    '--filter': `hue-rotate(${getHueRotateAmount(color)}deg)`,
  } as CSSProperties;

  return (
    <div
      ref={spriteRef}
      className="sprite"
      style={styleVars}
    />
  );
}
