<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import sprites, { spriteVersion } from '../stores/sprites';
import DuckySprite from './DuckySprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';
import getReadingLength from '@/util/getReadingLength.ts';
import { socket } from '@/socket.ts';
import type { Sprite } from '@/stores/sprites';
import type { AnimationResult } from '@/classes/SpriteAnimation';

const spritesTemplateRef = ref<HTMLDivElement | null>(null);
const boundingClientRectWidth = ref<number>(0);
const isMounted = ref(false);
let animationFrameId: number;
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const spriteAnimations: Map<string, SpriteAnimation> = new Map<string, SpriteAnimation>();
const pendingTimeouts: Map<string, ReturnType<typeof setTimeout>> = new Map<
  string,
  ReturnType<typeof setTimeout>
>();
const spriteElements: Map<string, HTMLElement> = new Map<string, HTMLElement>();
const updatedElements: Map<string, AnimationResult> = new Map();

const BUBBLE_HALF_WIDTH = 200;

socket.on('mention', (data: { fromUser: string; toUser: string }) => {
  const fromSprite = sprites[data.fromUser];
  const toSprite = sprites[data.toUser.toLowerCase()] || sprites[data.toUser];

  if (!fromSprite || !toSprite) return;

  const fromAnimation = spriteAnimations.get(data.fromUser);
  if (!fromAnimation) return;

  const fromX = fromSprite.position.x;
  const toX = toSprite.position.x;

  let targetX: number;
  if (fromX < toX) {
    targetX = toX - fromSprite.size - 10;
  } else {
    targetX = toX + toSprite.size + 10;
  }

  fromAnimation.runTo(targetX, 12);
});

socket.on('move', (data: { username: string }) => {
  const sprite = sprites[data.username];
  if (!sprite) return;

  const animation = spriteAnimations.get(data.username);
  if (!animation) return;

  // Pick a random target within walk bounds
  const walkStart = BUBBLE_HALF_WIDTH;
  const walkEnd = boundingClientRectWidth.value - BUBBLE_HALF_WIDTH - sprite.size;
  const randomTarget = walkStart + Math.floor(Math.random() * Math.max(0, walkEnd - walkStart));

  animation.runTo(randomTarget, 8);
});

const activeHugs: Map<string, { fromUser: string; toUser: string; arrivedCount: number }> =
  new Map();

socket.on('hug', (data: { fromUser: string; toUser: string }) => {
  const fromSprite = sprites[data.fromUser];
  const toSprite = sprites[data.toUser.toLowerCase()] || sprites[data.toUser];

  if (!fromSprite || !toSprite) return;
  if (data.fromUser === data.toUser) return; // can't hug yourself

  const fromAnimation = spriteAnimations.get(data.fromUser);
  const toUserKey = sprites[data.toUser.toLowerCase()] ? data.toUser.toLowerCase() : data.toUser;
  const toAnimation = spriteAnimations.get(toUserKey);

  if (!fromAnimation || !toAnimation) return;

  const fromX = fromSprite.position.x;
  const toX = toSprite.position.x;

  // Calculate meeting point in the middle
  const meetX = (fromX + toX) / 2;

  // Adjust targets so sprites meet side by side
  let fromTarget: number;
  let toTarget: number;
  if (fromX < toX) {
    fromTarget = meetX - fromSprite.size / 2 - 5;
    toTarget = meetX + toSprite.size / 2 + 5;
  } else {
    fromTarget = meetX + fromSprite.size / 2 + 5;
    toTarget = meetX - toSprite.size / 2 - 5;
  }

  // Track this hug
  const hugId = `${data.fromUser}-${toUserKey}`;
  activeHugs.set(hugId, { fromUser: data.fromUser, toUser: toUserKey, arrivedCount: 0 });

  fromAnimation.runTo(fromTarget, 12, () => {
    const hug = activeHugs.get(hugId);
    if (hug) {
      hug.arrivedCount++;
      if (hug.arrivedCount >= 2) {
        // Both arrived! Show hearts!
        showHugHearts(data.fromUser, toUserKey);
        activeHugs.delete(hugId);
      }
    }
  });

  toAnimation.runTo(toTarget, 12, () => {
    const hug = activeHugs.get(hugId);
    if (hug) {
      hug.arrivedCount++;
      if (hug.arrivedCount >= 2) {
        // Both arrived! Show hearts!
        showHugHearts(data.fromUser, toUserKey);
        activeHugs.delete(hugId);
      }
    }
  });
});

function showHugHearts(user1: string, user2: string): void {
  const sprite1 = sprites[user1];
  const sprite2 = sprites[user2];

  const heartMessage = { messageText: '💜', readingLength: 3000 };

  // Make sprites face each other
  if (sprite1 && sprite2) {
    if (sprite1.position.x < sprite2.position.x) {
      sprite1.deltaX = 1; // face right
      sprite2.deltaX = -1; // face left
    } else {
      sprite1.deltaX = -1; // face left
      sprite2.deltaX = 1; // face right
    }
  }

  // Show hearts with idle state (bypass normal message queue)
  if (sprite1) {
    sprite1.messages.unshift({ ...heartMessage });
    sprite1.state.key = 'idle';
    sprite1.state.isShowingMessage = true;
    sprite1.state.expiration = Date.now() + 600000;
  }
  if (sprite2) {
    sprite2.messages.unshift({ ...heartMessage });
    sprite2.state.key = 'idle';
    sprite2.state.isShowingMessage = true;
    sprite2.state.expiration = Date.now() + 600000;
  }

  // Clean up after delay
  setTimeout(() => {
    if (sprite1 && sprites[user1]) {
      sprite1.state.isShowingMessage = false;
      sprite1.state.key = 'walk';
      const idx = sprite1.messages.findIndex((m) => m.messageText === '💜');
      if (idx > -1) sprite1.messages.splice(idx, 1);
    }
    if (sprite2 && sprites[user2]) {
      sprite2.state.isShowingMessage = false;
      sprite2.state.key = 'walk';
      const idx = sprite2.messages.findIndex((m) => m.messageText === '💜');
      if (idx > -1) sprite2.messages.splice(idx, 1);
    }
  }, 3000);
}

function updateContainerWidth(): void {
  if (spritesTemplateRef.value) {
    boundingClientRectWidth.value = spritesTemplateRef.value.getBoundingClientRect().width;
  }
}

function debouncedResize(): void {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateContainerWidth, 100);
}

onMounted(() => {
  isMounted.value = true;
  updateContainerWidth();
  window.addEventListener('resize', debouncedResize);

  /**
   * Start the animation loop
   */
  animationFrameId = requestAnimationFrame(spriteAnimationLoop);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResize);
  if (resizeTimeout) clearTimeout(resizeTimeout);
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
    await nextTick();

    if (!spritesTemplateRef.value) {
      return;
    }

    Object.entries(sprites).forEach(([username, sprite]) => {
      if (!spriteElements.has(username)) {
        const spriteElement: HTMLElement | null | undefined =
          spritesTemplateRef.value?.querySelector(`[data-username="${username}"]`);

        if (spriteElement) {
          spriteElements.set(username, spriteElement);
          sprite.state.key = sprite.messages.length > 0 ? 'talk' : 'walk';

          const walkStart = BUBBLE_HALF_WIDTH;
          const walkEnd = boundingClientRectWidth.value - BUBBLE_HALF_WIDTH - sprite.size;
          const walkRange = Math.max(0, walkEnd - walkStart);
          const randomX = walkStart + Math.floor(Math.random() * walkRange);
          sprite.position = { x: randomX, y: 0 };
          spriteElement.style.transform = `translate3d(${randomX}px, 0, 0)`;

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

    spriteElements.forEach((_, username) => {
      if (!sprites[username]) {
        spriteElements.delete(username);
        spriteAnimations.delete(username);
      }
    });
  },
  { immediate: true },
);

/**
 * Our animation Loop. Controls the active sprite animation on class SpriteAnimation
 */
function spriteAnimationLoop(): void {
  if (!isMounted.value) {
    return;
  }

  updatedElements.clear();

  spriteElements.forEach((_, username) => {
    const sprite = sprites[username];

    if (!sprite) return;

    const animation = spriteAnimations.get(username);

    if (!animation) return;

    const isRunning = animation.isRunning;

    if (!isRunning && (sprite.state.key === 'idle' || sprite.state.key === 'talk')) return;

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
