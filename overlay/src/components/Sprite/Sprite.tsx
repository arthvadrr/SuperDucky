import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
  useContext,
} from 'react';
import { UserContext, type Users } from '../../context/UserContext';
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
  messages: string[];
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
  messages,
}: SpriteProps) {
  const [, setPosX] = useState(position.x);
  const [deltaX, setDeltaX] = useState(1);
  const deltaXRef = useRef(deltaX);

  useEffect(() => {
    deltaXRef.current = deltaX;
  }, [deltaX]);

  const { users, setUsers } = useContext(UserContext);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isShowingMessage, setIsShowingMessage] = useState<boolean>(false);
  const spriteRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const interval = 33;
  const hueRotateValue = useMemo(() => getHueRotateAmount(color), []);
  const speedRef = useRef(Math.random() * (3 - 0.5) + 0.5);
  const messageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Handle the chat bubble
   */
  useEffect(() => {
    if (!isShowingMessage || messages.length === 0 || !users?.[username])
      return;

    const readingLength = messages[0].split(' ').length * 500 + 5000;

    messageTimeout.current = setTimeout(() => {
      setIsShowingMessage(false);
      messageTimeout.current = null;

      setUsers((prev: Users) => ({
        ...prev,
        [username]: { ...prev[username], messages: messages.slice(1) },
      }));
    }, readingLength);

    return () => {
      if (messageTimeout.current) {
        clearTimeout(messageTimeout.current);
        messageTimeout.current = null;
      }
    };
  }, [isShowingMessage, messages.length, users, username]);

  useEffect(() => {
    if (messages.length > 0 && !isShowingMessage) {
      const delay = setTimeout(() => {
        setIsShowingMessage(true);
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [messages.length, isShowingMessage]);

  const animateWalk = useCallback(
    (time: number) => {
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
          const parentWidth =
            spriteRef.current?.parentElement?.clientWidth ?? 0;
          const width = spriteRef.current?.clientWidth ?? 0;
          let clampedX = nextX;
          let newDir = dir;

          /**
           * Collision check
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
    },
    [isPaused, interval],
  );

  /**
   * TODO merge into below useEffect (remove useEffect?)
   */
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
  }, [state, isPaused, animateWalk]);

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

  function getBackgroundImage() {
    let result = '';

    if (state === 'walk' && isPaused) {
      result = assets.idle;
    } else {
      result = assets[state];
    }

    return result;
  }

  const spriteStyles = useMemo<CSSPropertiesWithVars>(
    (): CSSPropertiesWithVars => ({
      '--width': `${size}px`,
      '--height': `${size}px`,
      '--bottom': `${position.y}px`,
      '--color': color,
      '--backgroundImage': `url(${getBackgroundImage()})`,
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

  const messageTextStyles = useMemo<CSSPropertiesWithVars>(
    (): CSSPropertiesWithVars => ({
      '--messageTextTransform':
        'translate(-50%)' + (deltaX < 0 ? 'scaleX(-1)' : 'scaleX(1)'),
    }),
    [deltaX, isShowingMessage],
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
        <div className="message-text-container">
          <div
            className={`message-text ${isShowingMessage ? 'visible' : 'hidden'}`}
            style={messageTextStyles}
          >
            {messages[0] ?? ''}
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(Sprite);
