<script setup lang="ts">
import { watch, watchEffect, useTemplateRef, ref, onBeforeUnmount } from 'vue';
import sprites from '../stores/sprites';
import DuckySprite from './DuckySprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';

const spritesTemplateRef = useTemplateRef<HTMLElement | null>('sprites');
const boundingClientRectWidth = ref<number>(0);

/**
 * Need to check for bounds in the grid item
 */
watchEffect(() => {
  if (spritesTemplateRef.value) {
    boundingClientRectWidth.value = spritesTemplateRef.value.getBoundingClientRect().width;
  }
});

let animationFrameId: number;

/**
 * Our animation Loop. Controls the active sprite animation on class SpriteAnimation
 */
function spriteAnimationLoop() {
  if (Object.entries(sprites).length > 0) {
    for (const username in sprites) {
      if (sprites[username].state.isPausedTimeout) {
        if (sprites[username].state.key !== 'idle') {
          sprites[username].state.key = 'idle';
        }
        continue;
      }

      if (!sprites[username]?.animation) {
        sprites[username].animation = new SpriteAnimation({
          posX: sprites[username].position.x ?? 0,
          deltaX: 1,
          speed: sprites[username].speed ?? 1,
          bounds: { start: 0, end: boundingClientRectWidth.value },
        });
      }

      if (sprites[username].state.key === 'walk') {
        const result = sprites[username].animation.animations[sprites[username].state.key]();
        sprites[username].position.x = result.posX;
        sprites[username].deltaX = result.deltaX;

        const shouldFlip = Math.random() < 0.000289;

        if (shouldFlip) {
          sprites[username].state.isPausedTimeout = setTimeout(
            () => {
              sprites[username].state.isPausedTimeout = null;
              sprites[username].state.key = 'walk';
            },
            Math.random() * (25000 - 16000) + 16000,
          );
        }
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

watchEffect(() => {
  for (const username in sprites) {
    const sprite = sprites[username];

    if (
      !sprite.state.isShowingMessage &&
      !sprite.state.isShowingMessageTimeout &&
      sprite.messages.length > 0
    ) {
      const readingLength = sprite.messages[0].split(' ').length * 500 + 5000;
      const prevState = sprite.state.key;

      sprite.state.key = 'talk';
      sprite.state.isShowingMessage = true;
      sprite.state.isShowingMessageTimeout = setTimeout(() => {
        sprite.state.isShowingMessage = false;
        sprite.state.isShowingMessageTimeout = setTimeout(() => {
          sprite.state.key = prevState;
          sprite.state.isShowingMessageTimeout = null;
          sprite.messages.shift();
        }, 1000);
      }, readingLength);
    }
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
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
