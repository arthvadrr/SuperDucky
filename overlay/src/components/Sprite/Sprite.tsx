import { useState, useEffect, useRef, memo, useMemo } from 'react';
import { getHueRotateAmount } from '../../util/getHueRotateAmount';
import type { CSSProperties } from 'react';
import '../../styles/Sprite.scss';

/**
 * Extend CSSProperties to include CSS custom properties (variables)
 */
type CSSVarProperties = {
  [key: `--${string}`]: string;
};

type CSSPropertiesWithVars = CSSProperties & CSSVarProperties;

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
  const [_, setPosX] = useState(position.x);
  const [deltaX, setDeltaX] = useState(1);
  const deltaXRef = useRef(deltaX);
  useEffect(() => {
    deltaXRef.current = deltaX;
  }, [deltaX]);
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
      lastTimeRef.current += interval;

      setPosX((prevX) => {
        const dir = deltaXRef.current;
        const nextX = prevX + dir * speedRef.current;
        const parentWidth = spriteRef.current?.parentElement?.clientWidth ?? 0;
        const width = spriteRef.current?.clientWidth ?? 0;
        let clampedX = nextX;
        let newDir = dir;

        /**
         * Collison check
         */
        if (nextX <= 0) {
          clampedX = 0;
          newDir = -dir;
        } else if (nextX + width >= parentWidth) {
          clampedX = parentWidth - width;
          newDir = -dir;
        }

        /**
         * Change direction if collided
         */
        if (newDir !== dir) {
          setDeltaX(newDir);
          deltaXRef.current = newDir;
        }

        /**
         * CSS transform determines which direction the sprite is facing
         */
        const transformValue = newDir < 0 ? 'scaleX(-1)' : 'scaleX(1)';

        /**
         * Apply the animation styles
         */
        if (spriteRef.current) {
          spriteRef.current.style.setProperty('--left', `${clampedX}px`);
          spriteRef.current.style.setProperty('--transform', transformValue);
        }

        return clampedX;
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

  const spriteStyles = useMemo<CSSPropertiesWithVars>(
    (): CSSPropertiesWithVars => ({
      '--width': `${size}px`,
      '--height': `${size}px`,
      '--bottom': `${position.y}px`,
      '--color': color,
      '--backgroundImage': `url(${state === 'walk' && isPaused ? assets.idle : assets[state]})`,
      '--filter': `hue-rotate(${hueRotateValue}deg)`,
    }),
    [size, position.y, state, isPaused, hueRotateValue],
  );

  const usernameStyles = useMemo<CSSPropertiesWithVars>(
    (): CSSPropertiesWithVars => ({
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
