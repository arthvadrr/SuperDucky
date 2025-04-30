import {
  MAX_SPRITE_SIZE,
  MAX_SPRITE_SPEED,
  MIN_SPRITE_SIZE,
  MIN_SPRITE_SPEED,
  MAX_FOOT_BOUNCE_DURATION,
  MIN_FOOT_BOUNCE_DURATION,
  MAX_WING_FLAP_DURATION,
  MIN_WING_FLAP_DURATION,
  MAX_HEAD_BOB_DURATION,
  MIN_HEAD_BOB_DURATION,
  MAX_EYE_BLINK_DURATION,
  MIN_EYE_BLINK_DURATION,
} from '@/util/constants.ts';

/**
 * Get random sprite attributes
 */
export const getRandomSpriteSpeed = (): number =>
  Math.random() * (MAX_SPRITE_SPEED - MIN_SPRITE_SPEED) + MIN_SPRITE_SPEED;

export const getRandomSpriteSize = (): number =>
  Math.random() * (MAX_SPRITE_SIZE - MIN_SPRITE_SIZE) + MIN_SPRITE_SIZE;

export const getRandomFootBounceDuration = (): number =>
  Math.random() * (MAX_FOOT_BOUNCE_DURATION - MIN_FOOT_BOUNCE_DURATION) + MIN_FOOT_BOUNCE_DURATION;

export const getRandomWingFlapDuration = (): number =>
  Math.random() * (MAX_WING_FLAP_DURATION - MIN_WING_FLAP_DURATION) + MIN_WING_FLAP_DURATION;

export const getRandomHeadBobDuration = (): number =>
  Math.random() * (MAX_HEAD_BOB_DURATION - MIN_HEAD_BOB_DURATION) + MIN_HEAD_BOB_DURATION;

export const getRandomEyeBlinkDuration = (): number =>
  Math.random() * (MAX_EYE_BLINK_DURATION - MIN_EYE_BLINK_DURATION) + MIN_EYE_BLINK_DURATION;
