import {
  MAX_SPRITE_SPEED,
  MIN_SPRITE_SPEED,
  MAX_SPRITE_SIZE,
  MIN_SPRITE_SIZE,
  FOOT_BOUNCE_DURATION,
  MAX_WING_FLAP_DURATION,
  MIN_WING_FLAP_DURATION,
  MAX_HEAD_BOB_DURATION,
  MIN_HEAD_BOB_DURATION,
  EYE_BLINK_DURATION_MAX,
  EYE_BLINK_DURATION_MIN,
} from '@/util/constants.ts';

/**
 * Get percentage of value between min and max
 */
export const getPercentageOfRange = (
  min: number,
  max: number,
  val: number,
  inverse: boolean,
): number => {
  if (max === min) return 0;

  const result: number = (val - min) / (max - min) / 2;

  if (inverse) {
    return 1 - result;
  } else {
    return (val - min) / (max - min) / 2;
  }
};

export const getPercSize = (size: number, inverse: boolean = false): number => {
  return getPercentageOfRange(MIN_SPRITE_SIZE, MAX_SPRITE_SIZE, size, inverse);
};

/**
 * Get random sprite attributes
 */
export const getRandomSpriteSize = (): number =>
  Math.random() * (MAX_SPRITE_SIZE - MIN_SPRITE_SIZE) + MIN_SPRITE_SIZE;

export const getSpriteSpeed = (size: number): number =>
  (Math.random() * (MAX_SPRITE_SPEED - MIN_SPRITE_SPEED) + MIN_SPRITE_SPEED) *
  getPercSize(size, true);

export const getFootBounceDuration = (size: number): number =>
  FOOT_BOUNCE_DURATION * (getPercSize(size) + 1);

export const getRandomWingFlapDuration = (size: number): number =>
  (Math.random() * (MAX_WING_FLAP_DURATION - MIN_WING_FLAP_DURATION) + MIN_WING_FLAP_DURATION) *
  (getPercSize(size) + 1);

export const getRandomHeadBobDuration = (size: number): number =>
  (Math.random() * (MAX_HEAD_BOB_DURATION - MIN_HEAD_BOB_DURATION) + MIN_HEAD_BOB_DURATION) *
  (getPercSize(size) + 1);

export const getEyeBlinkDuration = (): number =>
  Math.random() * (EYE_BLINK_DURATION_MAX - EYE_BLINK_DURATION_MIN) + EYE_BLINK_DURATION_MIN;
