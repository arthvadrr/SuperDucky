<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import { socket } from '@/socket.ts';
import sprites, { spriteVersion } from '../stores/sprites';
import DuckySprite from './DuckySprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import type { Sprite } from '@/stores/sprites';
import type { AnimationResult } from '@/classes/SpriteAnimation';

type ActiveHugs = Map<string, { fromUser: string; toUser: string; arrivedCount: number }>;

/**
 * References
 */
const spritesTemplateRef = ref<HTMLDivElement | null>(null);
const boundingClientRectWidth = ref<number>(0);
const isMounted = ref(false);
let animationFrameId: number;
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Sprite Animations
 */
const spriteAnimations: Map<string, SpriteAnimation> = new Map<string, SpriteAnimation>();
const pendingTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map<
  string,
  ReturnType<typeof setTimeout>
>();

/**
 * Sprite Elements
 */
const spriteElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();
const updatedElements: Map<string, AnimationResult> = new Map();

/**
 * Constants
 */
const BUBBLE_HALF_WIDTH = 200;

function spriteKey(input: string | null | undefined): string {
  return String(input ?? '').toLowerCase();
}

socket.on('mention', (data: { fromUser: string; toUser: string }) => {
  const fromKey = spriteKey(data.fromUser);
  const fromAnimation = spriteAnimations.get(fromKey);
  const fromSprite = sprites[fromKey];
  const toKey = spriteKey(data.toUser);
  const toSprite = sprites[toKey];
  let targetX: number;

  if (!fromSprite || !toSprite) {
    return;
  }

  const fromX = fromSprite.position.x;
  const toX = toSprite.position.x;

  if (!fromAnimation) {
    return;
  }

  if (fromX < toX) {
    targetX = toX - fromSprite.size - 10;
  } else {
    targetX = toX + toSprite.size + 10;
  }

  fromAnimation.runTo(targetX, 12);
});

socket.on('move', (data: { username: string }) => {
  const key = spriteKey(data.username);
  const sprite = sprites[key];
  const animation = spriteAnimations.get(key);

  if (!sprite) {
    return;
  }

  if (!animation) {
    return;
  }

  const walkEnd = boundingClientRectWidth.value - BUBBLE_HALF_WIDTH - sprite.size;
  const randomTarget =
    BUBBLE_HALF_WIDTH + Math.floor(Math.random() * Math.max(0, walkEnd - BUBBLE_HALF_WIDTH));

  animation.runTo(randomTarget, 8);
});

const activeHugs: ActiveHugs = new Map();

socket.on('hug', (data: { fromUser: string; toUser: string }) => {
  const fromKey = spriteKey(data.fromUser);
  const toKey = spriteKey(data.toUser);
  const fromSprite = sprites[fromKey];
  const toSprite = sprites[toKey];

  if (!fromSprite || !toSprite) {
    return;
  }

  if (fromKey === toKey) {
    return;
  }

  const fromAnimation = spriteAnimations.get(fromKey);
  const toAnimation = spriteAnimations.get(toKey);

  if (!fromAnimation || !toAnimation) {
    return;
  }

  const fromX = fromSprite.position.x;
  const toX = toSprite.position.x;
  const meetX = (fromX + toX) / 2;

  let fromTarget: number;
  let toTarget: number;

  if (fromX < toX) {
    fromTarget = meetX - fromSprite.size / 2 - 5;
    toTarget = meetX + toSprite.size / 2 + 5;
  } else {
    fromTarget = meetX + fromSprite.size / 2 + 5;
    toTarget = meetX - toSprite.size / 2 - 5;
  }

  const hugId = `${fromKey}-${toKey}`;
  activeHugs.set(hugId, { fromUser: fromKey, toUser: toKey, arrivedCount: 0 });

  fromAnimation.runTo(fromTarget, 12, () => {
    const hug = activeHugs.get(hugId);

    if (hug) {
      hug.arrivedCount++;

      if (hug.arrivedCount >= 2) {
        showHugHearts(fromKey, toKey);
        activeHugs.delete(hugId);
      }
    }
  });

  toAnimation.runTo(toTarget, 12, () => {
    const hug = activeHugs.get(hugId);

    if (hug) {
      hug.arrivedCount++;

      if (hug.arrivedCount >= 2) {
        showHugHearts(fromKey, toKey);
        activeHugs.delete(hugId);
      }
    }
  });
});

function showHugHearts(user1: string, user2: string): void {
  const huggerUser = spriteKey(user1);
  const huggedUser = spriteKey(user2);
  const huggerSprite = sprites[huggerUser];
  const huggedSprite = sprites[huggedUser];
  const heartMessage = { messageText: '💜', readingLength: 3000 };

  /**
   * Make sure they face each other
   */
  if (huggerSprite && huggedSprite) {
    if (huggerSprite.position.x < huggedSprite.position.x) {
      huggerSprite.deltaX = 1;
      huggedSprite.deltaX = -1;
    } else {
      huggerSprite.deltaX = -1;
      huggedSprite.deltaX = 1;
    }
  }

  if (huggerSprite) {
    huggerSprite.messages.unshift({ ...heartMessage });
    huggerSprite.state.key = 'idle';
    huggerSprite.state.isShowingMessage = true;
    huggerSprite.state.expiration = Date.now() + 600000;
  }

  if (huggedSprite) {
    huggedSprite.messages.unshift({ ...heartMessage });
    huggedSprite.state.key = 'idle';
    huggedSprite.state.isShowingMessage = true;
    huggedSprite.state.expiration = Date.now() + 600000;
  }

  setTimeout(() => {
    if (huggerSprite && sprites[huggerUser]) {
      const huggerSpriteIndex = huggerSprite.messages.findIndex((m) => m.messageText === '💜');
      huggerSprite.state.isShowingMessage = false;
      huggerSprite.state.key = 'walk';

      if (huggerSpriteIndex > -1) {
        huggerSprite.messages.splice(huggerSpriteIndex, 1);
      }
    }

    if (huggedSprite && sprites[huggedUser]) {
      const huggedSpriteIndex = huggedSprite.messages.findIndex((m) => m.messageText === '💜');
      huggedSprite.state.isShowingMessage = false;
      huggedSprite.state.key = 'walk';

      if (huggedSpriteIndex > -1) {
        huggedSprite.messages.splice(huggedSpriteIndex, 1);
      }
    }
  }, 3000);
}

function updateContainerWidth(): void {
  if (spritesTemplateRef.value) {
    boundingClientRectWidth.value = spritesTemplateRef.value.getBoundingClientRect().width;
  }
}

function debouncedResize(): void {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(updateContainerWidth, 100);
}

async function syncSpritesToDom(): Promise<void> {
  await nextTick();

  if (!spritesTemplateRef.value) {
    return;
  }

  Object.entries(sprites).forEach(([username, sprite]) => {
    if (!spriteElements.has(username)) {
      const safeUsername = CSS.escape(username) ?? username;
      const spriteElement: HTMLElement | null | undefined = spritesTemplateRef.value?.querySelector(
        `[data-username="${safeUsername}"]`,
      );

      if (spriteElement) {
        const walkStart = BUBBLE_HALF_WIDTH;
        const walkEnd = boundingClientRectWidth.value - BUBBLE_HALF_WIDTH - sprite.size;
        const walkRange = Math.max(0, walkEnd - walkStart);
        const randomX = walkStart + Math.floor(Math.random() * walkRange);

        spriteElements.set(username, spriteElement);
        spriteElement.style.transform = `translate3d(${randomX}px, 0, 0)`;
        sprite.state.key = sprite.messages.length > 0 ? 'talk' : 'walk';
        sprite.position = { x: randomX, y: 0 };

        if (!spriteAnimations.has(username)) {
          spriteAnimations.set(
            username,
            new SpriteAnimation({
              posX: randomX,
              deltaX: Math.random() < 0.5 ? -1 : 1,
              speed: sprite.speed ?? 1,
              bounds: {
                start: walkStart,
                end: walkEnd,
              },
            }),
          );
        }
      }
    }
  });

  /**
   * Clean up any removed sprites
   */
  spriteElements.forEach((_, username) => {
    if (!sprites[username]) {
      spriteElements.delete(username);
      spriteAnimations.delete(username);
    }
  });
}

onMounted(() => {
  isMounted.value = true;
  updateContainerWidth();
  void syncSpritesToDom();
  window.addEventListener('resize', debouncedResize);
  animationFrameId = requestAnimationFrame(spriteAnimationLoop);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize);

  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  cancelAnimationFrame(animationFrameId);
  pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  pendingTimeouts.clear();
  spriteAnimations.clear();
  spriteElements.clear();
});

/**
 * Watch for container width changes and update our animation bounds
 */
watch(spritesTemplateRef, (newValue) => {
  if (newValue) {
    updateContainerWidth();
  }
});

watch(
  spriteVersion,
  async () => {
    await syncSpritesToDom();
  },
  { immediate: true },
);

/**
 * Animation loop - controls sprite movement via SpriteAnimation class
 */
function spriteAnimationLoop(): void {
  if (!isMounted.value) {
    return;
  }

  updatedElements.clear();

  spriteElements.forEach((_, username) => {
    const sprite = sprites[username];

    if (!sprite) {
      return;
    }

    const animation = spriteAnimations.get(username);

    if (!animation) {
      return;
    }

    const isRunning = animation.isRunning;

    if (!isRunning && (sprite.state.key === 'idle' || sprite.state.key === 'talk')) {
      return;
    }

    const result = animation.animateWalk();
    sprite.state.isRunning = result.isRunning ?? false;

    /**
     * Store the result for later
     */
    updatedElements.set(username, result);

    /**
     * Randomly pause the sprite's movement for a while
     */
    const shouldPause = Math.random() < 0.002;

    if (shouldPause) {
      const pauseDuration = Math.random() * (25000 - 16000) + 16000;

      /**
       * Pause the sprite for a while
       */
      sprite.state.key = 'idle';

      const timeoutId = setTimeout(() => {
        sprite.state.isPausedTimeout = null;
        sprite.state.key = 'walk';
        pendingTimeouts.delete(username);
      }, pauseDuration);

      sprite.state.isPausedTimeout = Number(timeoutId);
      pendingTimeouts.set(username, timeoutId);
    }
  });

  /**
   * Apply all batched updates to DOM and sprite state
   */
  updatedElements.forEach(({ posX, deltaX }, username) => {
    const spriteElement = spriteElements.get(username);

    if (spriteElement) {
      spriteElement.style.transform = `translate3d(${posX}px, 0, 0)`;
    }

    if (sprites[username]) {
      sprites[username].position.x = posX;
      sprites[username].deltaX = deltaX;
    }
  });

  /**
   * Request next animation frame
   */
  animationFrameId = requestAnimationFrame(spriteAnimationLoop);
}

/**
 * Sync animations to browser frames
 */
watch(
  () => Object.entries(sprites).length,
  (length) => {
    if (length > 0 && spritesTemplateRef.value) {
      void syncSpritesToDom();
      /**
       * If we have sprites, start the animation loop
       */
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(spriteAnimationLoop);
    }
  },
  { immediate: true },
);

/**
 * Handle chat bubbles and message timing
 */
watchEffect(() => {
  for (const username in sprites) {
    if (sprites[username]) {
      const sprite: Sprite = sprites[username];

      /**
       * Show new message if none are currently displayed
       */
      if (
        !sprite.state.isShowingMessage &&
        !sprite.state.isShowingMessageTimeout &&
        sprite.messages.length > 0
      ) {
        if (sprite.messages[0]) {
          const readingLength: number = getReadingLength(sprite.messages[0].messageText);

          /**
           * Show chat bubble and set sprite to talking state
           */
          sprite.state.key = 'talk';
          sprite.state.isShowingMessage = true;

          /**
           * Clear any pending timeouts and durations
           */
          sprite.state.isPausedTimeout = null;
          sprite.state.isPausedDuration = 0;

          /**
           * Hide message after reading time, then set state to walk
           */
          const messageTimeoutId = setTimeout(() => {
            sprite.state.isShowingMessage = false;

            const resetTimeoutId = setTimeout(() => {
              sprite.state.isShowingMessageTimeout = null;
              sprite.messages.shift();
              pendingTimeouts.delete(`${username}-reset`);
            }, 1000);

            sprite.state.isShowingMessageTimeout = Number(resetTimeoutId);
            pendingTimeouts.set(`${username}-reset`, resetTimeoutId);
            sprite.state.key = 'walk';
          }, readingLength ?? 3000);

          /**
           * Store timeout for cleanup
           */
          sprite.state.isShowingMessageTimeout = Number(messageTimeoutId);
          pendingTimeouts.set(`${username}-message`, messageTimeoutId);
        }
      }
    }
  }
});
</script>

<template>
  <div
    class="sprites"
    ref="spritesTemplateRef"
  >
    <DuckySprite
      v-for="(value, key) in sprites"
      v-memo="[
        value.state.key,
        value.state.isShowingMessage,
        value.state.isRunning,
        value.messages.length,
        value.color,
        value.deltaX,
      ]"
      :sprite="value"
      :key="key"
      :data-username="key"
    />
  </div>
</template>

<style lang="scss">
.sprites {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
