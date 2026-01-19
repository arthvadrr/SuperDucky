export interface AnimationProps {
  deltaX?: -1 | 1;
  posX?: number;
  speed?: number;
  bounds: Record<'start' | 'end', number>;
}

export interface AnimationResult {
  posX: number;
  deltaX: -1 | 1;
  isRunning?: boolean;
}

export default class SpriteAnimation {
  posX: number;
  deltaX: -1 | 1;
  private readonly bounds: Record<'start' | 'end', number>;
  private readonly speed: number;
  private targetX: number | null = null;
  private runSpeed: number = 3;
  private onArriveCallback: (() => void) | null = null;

  constructor({ posX = 0, deltaX = 1, speed = 1, bounds = { start: 0, end: 0 } }: AnimationProps) {
    this.posX = posX;
    this.deltaX = deltaX;
    this.speed = speed;
    this.bounds = bounds;
  }

  runTo(targetX: number, speedMultiplier: number = 3, onArrive?: () => void): void {
    this.targetX = targetX;
    this.runSpeed = this.speed * speedMultiplier;
    this.onArriveCallback = onArrive ?? null;
  }

  animateWalk(): AnimationResult {
    const { start, end } = this.bounds;
    let distance: number;
    let callback: (() => void) | null;

    if (this.targetX !== null) {
      distance = this.targetX - this.posX;

      if (Math.abs(distance) < this.runSpeed) {
        this.posX = this.targetX;
        this.targetX = null;
        callback = this.onArriveCallback;
        this.onArriveCallback = null;

        if (callback) {
          callback();
        }

        return { posX: this.posX, deltaX: this.deltaX, isRunning: false };
      }

      this.deltaX = distance > 0 ? 1 : -1;
      this.posX += this.deltaX * this.runSpeed;

      return { posX: this.posX, deltaX: this.deltaX, isRunning: true };
    }

    if (this.deltaX === 1 && this.posX >= end) {
      this.deltaX = -1;
    } else if (this.deltaX === -1 && this.posX <= start) {
      this.deltaX = 1;
    }

    this.posX += this.deltaX * this.speed;

    return {
      posX: this.posX,
      deltaX: this.deltaX,
      isRunning: false,
    };
  }

  get position(): number {
    return this.posX;
  }

  get isRunning(): boolean {
    return this.targetX !== null;
  }
}
