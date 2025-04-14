import { useState, useEffect, useRef, useCallback } from 'react';
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
  username: string;
  size: number;
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
  size,
  position = { x: 0, y: 0 },
  state = 'walk',
  username = '',
}: SpriteProps) {
  const spriteRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<number | null>(null);
  const [posX, setPosX] = useState(position.x);
  const [deltaX, setDeltaX] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const rotatedHue = useCallback(() => getHueRotateAmount(color), [color]);
  const speedRef = useRef(Math.random() * (3 - 0.5) + 0.5);

  function animateWalk() {
    const sprite = spriteRef.current;

    if (isPaused) {
      return;
    }

    if (sprite && sprite.parentElement) {
      const parentWidth = sprite.parentElement.clientWidth;
      const width = sprite.clientWidth;
      const newX = posX + deltaX * speedRef.current;

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
  }, [state, posX, deltaX, isPaused]);

  useEffect(() => {
    if (state !== 'walk') return;

    let timerId: NodeJS.Timeout;

    if (!isPaused) {
      const pauseAfter = Math.random() * 20000 + 1000;
      timerId = setTimeout(() => {
        setIsPaused(true);
      }, pauseAfter);
    } else {
      const resumeAfter = Math.random() * 20000 + 1000;
      timerId = setTimeout(() => {
        setDeltaX(Math.random() > 0.5 ? 1 : -1);
        speedRef.current = Math.random() * (3 - 0.5) + 0.5;
        setIsPaused(false);
      }, resumeAfter);
    }

    return () => clearTimeout(timerId);
  }, [state, isPaused]);

  const spriteStyles: CSSProperties = {
    '--width': `${size}px`,
    '--height': `${size}px`,
    '--left': `${posX}px`,
    '--bottom': `${position.y}px`,
    '--color': color,
    '--transform': deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)',
    '--backgroundImage': `url(${state === 'walk' && isPaused ? assets.idle : assets[state]})`,
    '--filter': `hue-rotate(${rotatedHue()}deg)`,
  } as CSSProperties;

  const usernameStyles: CSSProperties = {
    '--usernameTransform':
      'translate(0, -130%)' + (deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)'),
  } as CSSProperties;

  return (
    <div
      ref={spriteRef}
      className="sprite-container"
      style={spriteStyles}
    >
      <div
        className="sprite"
        style={usernameStyles}
      ></div>
      <div
        className="username"
        style={usernameStyles}
      >
        {username}
      </div>
    </div>
  );
}
