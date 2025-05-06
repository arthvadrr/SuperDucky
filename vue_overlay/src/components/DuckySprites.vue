<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import sprites from '../stores/sprites';
import DuckySprite from './DuckySprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import type { Sprite } from '@/stores/sprites';
import type { AnimationResult } from '@/classes/SpriteAnimation';

const spritesTemplateRef = ref<HTMLDivElement | null>(null);
const boundingClientRectWidth = ref<number>(0);
const isMounted = ref(false);
let animationFrameId: number;

/**
 * Store sprite animations in a non-reactive object
 */
const spriteAnimations: Map<string, SpriteAnimation> = new Map<string, SpriteAnimation>();
const pendingTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map<
  string,
  ReturnType<typeof setTimeout>
>();
const spriteElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();

/**
 * Update container width and handle window resize
 */
function updateContainerWidth(): void {
  if (spritesTemplateRef.value) {
    boundingClientRectWidth.value = spritesTemplateRef.value.getBoundingClientRect().width;
  }
}

onMounted(() => {
  isMounted.value = true;
  updateContainerWidth();
  window.addEventListener('resize', updateContainerWidth);

  /**
   * Start the animation loop
   */
  animationFrameId = requestAnimationFrame(spriteAnimationLoop);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateContainerWidth);
  cancelAnimationFrame(animationFrameId);
  /**
   * Clear all pending timeouts
   */
  pendingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  pendingTimeouts.clear();
  /**
   * Clear all sprite animations
   */
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

/**
 * Watch for sprite changes and update our Maps
 */
watch(
  () => sprites,
  async (newSprites) => {
    /**
     * Wait for next tick to ensure DOM is updated
     */
    await nextTick();

    /**
     * No container ref yet, so we can't do anything
     */
    if (!spritesTemplateRef.value) {
      return;
    }

    /**
     * Find new sprites
     */
    Object.entries(newSprites).forEach(([username, sprite]) => {
      if (!spriteElements.has(username)) {
        const spriteElement: HTMLElement | null | undefined =
          spritesTemplateRef.value?.querySelector(`[data-username="${username}"]`);

        if (spriteElement) {
          spriteElements.set(username, spriteElement);
          /**
           * Set initial state
           */
          sprite.state.key = sprite.messages.length > 0 ? 'talk' : 'walk';

          if (!sprite.position) {
            sprite.position = { x: 0, y: 0 };
          }

          /**
           * Create new animation if one doesn't exist.
           */
          if (!spriteAnimations.has(username)) {
            spriteAnimations.set(
              username,
              new SpriteAnimation({
                posX: sprite.position.x,
                deltaX: 1,
                speed: sprite.speed ?? 1,
                bounds: {
                  start: 0,
                  end: boundingClientRectWidth.value ?? 0,
                },
              }),
            );
          }
        }
      }
    });

    /**
     * Find removed sprites
     */
    spriteElements.forEach((_, username) => {
      if (!newSprites[username]) {
        spriteElements.delete(username);
        spriteAnimations.delete(username);
      }
    });
  },
  { deep: true },
);

/**
 * Our animation Loop. Controls the active sprite animation on class SpriteAnimation
 */
function spriteAnimationLoop(): void {
  if (!isMounted.value) {
    return;
  }

  const updatedElements: Map<string, AnimationResult> = new Map();

  spriteElements.forEach((_, username) => {
    const sprite = sprites[username];

    if (!sprite) return;

    const animation = spriteAnimations.get(username);

    if (!animation) return;

    /**
     * If the sprite is paused, skip animation logic
     */

    if (sprite.state.key === 'idle' || sprite.state.key === 'talk') return;

    const result = animation.animateWalk();

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

      sprite.state.isPausedTimeout = timeoutId;
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

    sprites[username].position.x = posX;
    sprites[username].deltaX = deltaX;
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
    const sprite: Sprite = sprites[username];

    /**
     * Show new message if none are currently displayed
     */
    if (
      !sprite.state.isShowingMessage &&
      !sprite.state.isShowingMessageTimeout &&
      sprite.messages.length > 0
    ) {
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

        sprite.state.isShowingMessageTimeout = resetTimeoutId;
        pendingTimeouts.set(`${username}-reset`, resetTimeoutId);
        sprite.state.key = 'walk';
      }, readingLength);

      /**
       * Store timeout for cleanup
       */
      sprite.state.isShowingMessageTimeout = messageTimeoutId;
      pendingTimeouts.set(`${username}-message`, messageTimeoutId);
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
