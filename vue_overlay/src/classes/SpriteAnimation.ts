export interface AnimationProps {
  deltaX?: -1 | 1;
  posX?: number;
  speed?: number;
  bounds: Record<'start' | 'end', number>;
}

export interface AnimationResult {
  posX: number;
  deltaX: -1 | 1;
}

/**
 * Represents a sprite animation for horizontal movement.
 * The animation updates the position of the sprite based on the direction,
 * speed, and defined bounds. Quack.
 */
export default class SpriteAnimation {
  posX: number;
  deltaX: -1 | 1;
  private readonly bounds: Record<'start' | 'end', number>;
  private readonly speed: number;

  constructor({ posX = 0, deltaX = 1, speed = 1, bounds = { start: 0, end: 0 } }: AnimationProps) {
    this.posX = posX;
    this.deltaX = deltaX;
    this.speed = speed;
    this.bounds = bounds;
  }

  animateWalk(): AnimationResult {
    const { start, end } = this.bounds;

    if (this.deltaX === 1 && this.posX >= end) {
      this.deltaX = -1;
    } else if (this.deltaX === -1 && this.posX <= start) {
      this.deltaX = 1;
    }

    this.posX += this.deltaX * this.speed;

    return {
      posX: this.posX,
      deltaX: this.deltaX,
    };
  }

  get position(): number {
    return this.posX;
  }
}
