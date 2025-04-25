<script setup lang="ts">
import type { Sprite } from '@/stores/sprites.ts';

const { sprite } = defineProps<{
  sprite: Sprite;
}>();

const { username, color, messages, assets, state, speed, size, position } = sprite;

console.log('state', state);
console.log('sprite', sprite);
</script>

<template>
  <div class="sprite">
    <img
      class="ducky-image"
      alt="Ducky!"
      :src="assets[state]"
      :style="{
        left: `${position.x}px`,
        width: `${size}px`,
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
