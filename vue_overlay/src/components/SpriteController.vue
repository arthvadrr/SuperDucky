<script setup lang="ts">
import { watch, watchEffect, useTemplateRef, ref, onBeforeUnmount } from 'vue';
import sprites from '../stores/sprites';
import Sprite from './Sprite.vue';
import SpriteAnimation from '@/classes/SpriteAnimation.ts';

const spritesTemplateRef = useTemplateRef<HTMLElement | null>('sprites');
const boundingClientRectWidth = ref<number>(0);

watchEffect(() => {
  if (spritesTemplateRef.value) {
    boundingClientRectWidth.value = spritesTemplateRef.value.getBoundingClientRect().width;
  }
});

let animationFrameId: number;

function animate() {
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
          Math.random() * (16000 - 8000) + 8000,
        );
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}

watch(
  () => Object.entries(sprites).length,
  () => {
    animationFrameId = requestAnimationFrame(animate);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div
    class="sprites"
    ref="sprites"
  >
    <div v-if="Object.entries(sprites).length">
      <Sprite
        v-for="(value, key) in sprites"
        :sprite="value"
        :key="key"
      />
    </div>
  </div>
</template>

<style lang="scss">
.sprites {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
