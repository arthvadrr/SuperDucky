<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import sprites from '../stores/sprites';
import DuckySprite from './DuckySprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import type { Sprite, SpriteStateKey } from '@/stores/sprites';
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

  // Start animation loop
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

// Add after the ref declarations
watch(spritesTemplateRef, (newValue) => {
  console.log('Container ref changed:', newValue);
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
        const spriteElement = spritesTemplateRef.value?.querySelector(
          `[data-username="${username}"]`,
        ) as HTMLElement;

        if (spriteElement) {
          spriteElements.set(username, spriteElement);

          /**
           * Set initial state to walk
           */
          sprite.state.key = 'walk';
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

  const spritesContainer = spritesTemplateRef.value;

  if (!spritesContainer) {
    return;
  }

  for (const [username, spriteElement] of spriteElements) {
    const sprite: Sprite = sprites[username];
    if (!sprite) {
      continue;
    }

    if (sprite.state.isPausedTimeout) {
      if (sprite.state.key !== 'idle') {
        sprite.state.key = 'idle';
      }
      continue;
    }

    const animation = spriteAnimations.get(username);
    if (!animation) {
      continue;
    }

    if (sprite.state.key === 'walk') {
      /**
       * Update position using SpriteAnimation
       */
      const result: AnimationResult = animation.animations.walk();
      spriteElement.style.transform = `translateX(${result.posX}px)`;
      sprite.deltaX = result.deltaX;
      sprite.position.x = result.posX;

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
