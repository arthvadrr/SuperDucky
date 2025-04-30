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

  constructor({ posX, deltaX, speed, bounds }: AnimationProps) {
    this.posX = posX ?? 0;
    this.deltaX = deltaX ?? 1;
    this.speed = speed ?? 1;
    this.bounds = bounds ?? {
      start: 0,
      end: 0,
    };
  }

  animations: Record<string, () => AnimationResult> = {
    walk: this.animateWalk.bind(this),
  };

  animateWalk(): AnimationResult {
    if (this.deltaX === 1 && this.posX >= this.bounds.end) {
      this.deltaX = -1;
    } else if (this.deltaX === -1 && this.posX <= this.bounds.start) {
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
