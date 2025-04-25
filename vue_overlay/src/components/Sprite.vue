<script setup lang="ts">
import type { Sprite } from '@/stores/sprites.ts';

const { sprite } = defineProps<{
  sprite: Sprite;
}>();

const { assets, state, size, deltaX } = sprite;
</script>

<template>
  <div class="sprite">
    <h1>{{ deltaX }}</h1>
    <img
      class="ducky-image"
      alt="Ducky!"
      :src="assets[state.key]"
      :style="{
        left: `${sprite.position.x}px`,
        width: `${size}px`,
        transform: `scale(${sprite.deltaX}, 1)`,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.sprite .ducky-image {
  position: absolute;
  bottom: 0;
}
</style>
