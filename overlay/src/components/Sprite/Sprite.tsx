import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
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
function Sprite({
  assets,
  color = '',
  size,
  position = { x: 0, y: 0 },
  state = 'walk',
  username = '',
}: SpriteProps) {
  const [posX, setPosX] = useState(position.x);
  const [deltaX, setDeltaX] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const spriteRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const interval = 1000 / 30; // 30fps throttle
  const hueRotateValue = useMemo(() => getHueRotateAmount(color), []);
  const speedRef = useRef(Math.random() * (3 - 0.5) + 0.5);

  function animateWalk(time: number) {
    if (isPaused) {
      lastTimeRef.current = 0;
      return;
    }

    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }
    const elapsed = time - lastTimeRef.current;
    if (elapsed >= interval) {
      lastTimeRef.current = time - (elapsed % interval);

      const parentWidth = spriteRef.current?.parentElement?.clientWidth ?? 0;
      const width = spriteRef.current?.clientWidth ?? 0;
      setPosX((prevX) => {
        const nextX = prevX + deltaX * speedRef.current;
        const transformValue = deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)';
        if (spriteRef.current) {
          spriteRef.current.style.setProperty('--left', `${nextX}px`);
          spriteRef.current.style.setProperty('--transform', transformValue);
        }
        if (nextX <= 0 || nextX + width >= parentWidth) {
          setDeltaX((d) => -d);
          return prevX;
        }
        return nextX;
      });
    }

    frameRef.current = requestAnimationFrame(animateWalk);
  }

  useEffect(() => {
    if (state === 'walk' && !isPaused) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(animateWalk);
    }
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [state, isPaused]);

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

  const spriteStyles = useMemo(
    (): CSSProperties => ({
      '--width': `${size}px`,
      '--height': `${size}px`,
      '--bottom': `${position.y}px`,
      '--color': color,
      '--backgroundImage': `url(${state === 'walk' && isPaused ? assets.idle : assets[state]})`,
      '--filter': `hue-rotate(${hueRotateValue}deg)`,
    }),
    [size, position.y, state, isPaused, hueRotateValue],
  );

  const usernameStyles = useMemo(
    (): CSSProperties => ({
      '--usernameTransform':
        'translate(0, -130%)' + (deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)'),
    }),
    [deltaX],
  );

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
export default memo(Sprite);
