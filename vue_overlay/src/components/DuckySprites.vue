<script setup lang="ts">
import { watch, watchEffect, useTemplateRef, ref, onBeforeUnmount, onMounted } from 'vue';
import sprites from '../stores/sprites';
import DuckySprite from './DuckySprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import type { Sprite, SpriteStateKey } from '@/stores/sprites';
import type { AnimationResult } from '@/classes/SpriteAnimation';

/**
 * Get the sprites container element and its width
 */
const spritesTemplateRef: ReturnType<typeof useTemplateRef<HTMLDivElement>> =
  useTemplateRef<HTMLDivElement>('sprites');
const boundingClientRectWidth: ReturnType<typeof ref<number>> = ref<number>(0);

/**
 * Store sprite animations in a non-reactive object
 */
const spriteAnimations: Map<string, SpriteAnimation> = new Map<string, SpriteAnimation>();
const pendingTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map<
  string,
  ReturnType<typeof setTimeout>
>();

/**
 * Update container width and handle window resize
 */
function updateContainerWidth(): void {
  if (spritesTemplateRef.value) {
    boundingClientRectWidth.value = spritesTemplateRef.value.getBoundingClientRect().width;
  }
}

onMounted(() => {
  updateContainerWidth();
  window.addEventListener('resize', updateContainerWidth);
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
});

/**
 * Clean up removed sprites
 */
watch(
  () => Object.keys(sprites),
  (newKeys: string[], oldKeys: string[]) => {
    /**
     * Find removed sprites
     */
    const removedSprites = oldKeys.filter((key) => !newKeys.includes(key));

    /**
     * Clean up animations and timeouts for removed sprites
     */
    removedSprites.forEach((username) => {
      spriteAnimations.delete(username);
      /**
       * Clean up any pending timeouts for this sprite
       */
      const messageTimeout = pendingTimeouts.get(`${username}-message`);
      const resetTimeout = pendingTimeouts.get(`${username}-reset`);
      const pauseTimeout = pendingTimeouts.get(username);

      if (messageTimeout) {
        clearTimeout(messageTimeout);
        pendingTimeouts.delete(`${username}-message`);
      }
      if (resetTimeout) {
        clearTimeout(resetTimeout);
        pendingTimeouts.delete(`${username}-reset`);
      }
      if (pauseTimeout) {
        clearTimeout(pauseTimeout);
        pendingTimeouts.delete(username);
      }
    });
  },
);

/**
 * Need to check for bounds in the grid item
 */
watchEffect(() => {
  updateContainerWidth();
});

let animationFrameId: number;

/**
 * Our animation Loop. Controls the active sprite animation on class SpriteAnimation
 */
function spriteAnimationLoop(): void {
  const spritesContainer = spritesTemplateRef.value;
  if (!spritesContainer) return;

  for (const username in sprites) {
    const sprite: Sprite = sprites[username];
    const spriteElement = spritesContainer.querySelector(
      `[data-username="${username}"]`,
    ) as HTMLElement;
    if (!spriteElement) continue;

    if (sprite.state.isPausedTimeout) {
      if (sprite.state.key !== 'idle') {
        sprite.state.key = 'idle';
      }
      continue;
    }

    if (!spriteAnimations.has(username)) {
      /**
       * Initialize sprite animation
       */
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

    const animation = spriteAnimations.get(username)!;

    if (sprite.state.key === 'walk') {
      /**
       * Update position using SpriteAnimation
       */
      const result: AnimationResult = animation.animations.walk();

      /**
       * Update DOM with animation result
       */
      spriteElement.style.transform = `translateX(${result.posX}px)`;
      sprite.deltaX = result.deltaX;

      /**
       * Randomly flip the sprite (sometimes they like to change direction!)
       * Then handle pausing the sprite for a random amount of time
       */
      const shouldFlip = Math.random() < 0.000289;

      if (shouldFlip) {
        const timeoutId = setTimeout(
          () => {
            sprite.state.isPausedTimeout = null;
            sprite.state.key = 'walk';
            pendingTimeouts.delete(username);
          },
          Math.random() * (25000 - 16000) + 16000,
        );
        sprite.state.isPausedTimeout = timeoutId;
        pendingTimeouts.set(username, timeoutId);
      }
    }
  }

  animationFrameId = requestAnimationFrame(spriteAnimationLoop);
}

/**
 * Sync animations to browser frames
 */
watch(
  () => Object.entries(sprites).length,
  () => {
    animationFrameId = requestAnimationFrame(spriteAnimationLoop);
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
      const prevState: SpriteStateKey = sprite.state.key;

      /**
       * Show chat bubble and set sprite to talking state
       */
      sprite.state.key = 'talk';
      sprite.state.isShowingMessage = true;

      /**
       * Hide message after reading time, then return to previous state
       */
      const messageTimeoutId = setTimeout(() => {
        sprite.state.isShowingMessage = false;
        const resetTimeoutId = setTimeout(() => {
          sprite.state.key = prevState;
          sprite.state.isShowingMessageTimeout = null;
          sprite.messages.shift();
          pendingTimeouts.delete(`${username}-reset`);
        }, 1000);
        sprite.state.isShowingMessageTimeout = resetTimeoutId;
        pendingTimeouts.set(`${username}-reset`, resetTimeoutId);
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
    ref="sprites"
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
