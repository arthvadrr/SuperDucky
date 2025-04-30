import type { SpriteStateKey } from '@/stores/sprites.ts';

/**
 * Static asset paths
 */
export const DUCKY_ASSETS: Record<SpriteStateKey, string> = {
  idle: '/sprites/baby-ducky/baby-ducky-idle.webp',
  walk: '/sprites/baby-ducky/baby-ducky-walk.webp',
  talk: '/sprites/baby-ducky/baby-ducky-talking.webp',
}

export const MAX_SPRITE_SPEED: number = 0.5;
export const MIN_SPRITE_SPEED: number = 0.1;
export const MAX_SPRITE_SIZE: number = 150;
export const MIN_SPRITE_SIZE: number = 75;
export const MAX_WING_FLAP_DURATION: number = 15;
export const MIN_WING_FLAP_DURATION: number = 8;
export const MAX_HEAD_BOB_DURATION: number = 18;
export const MIN_HEAD_BOB_DURATION: number = 12;
export const MAX_EYE_BLINK_DURATION: number = 12;
export const MIN_EYE_BLINK_DURATION: number = 8;
export const MAX_FOOT_BOUNCE_DURATION: number = 0.5;
export const MIN_FOOT_BOUNCE_DURATION: number = 0.3;
