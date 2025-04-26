<script setup lang="ts">
import type { Sprite } from '@/stores/sprites.ts';

defineProps<{
  sprite: Sprite;
}>();
</script>

<template>
  <div
    class="sprite-container"
    :style="{
      left: `${sprite.position.x}px`,
    }"
  >
    <div class="nameplate-container">
      <div
        class="nameplate"
        :style="{
          color: sprite.color,
        }"
      >
        {{ sprite.username }}
      </div>
    </div>
    <img
      class="sprite"
      alt="Ducky!"
      :src="sprite.assets[sprite.state.key]"
      :style="{
        width: `${Math.round(sprite.size)}px`,
        transform: `scale(${sprite.deltaX}, 1)`,
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.sprite-container,
.ducky-image {
  position: absolute;
  bottom: 0;
}

.sprite-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sprite {
  position: relative;
  vertical-align: bottom;
}

.nameplate-container {
  padding: 2px 8px;
  background: rgba(#18181c, 0.85);
  font-size: 14px;
  margin-bottom: 8px;
  border: 1px solid #000;
}
</style>
