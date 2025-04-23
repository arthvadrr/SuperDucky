<script setup lang="ts">
import sprites from '@/stores/sprites.ts';
import messages from '@/stores/messages.ts';
import { onMounted, ref, watch, useTemplateRef } from 'vue';
import type { Sprite } from '@/stores/sprites.ts';

const footer = ref<HTMLElement | null>(null);
const canvas = useTemplateRef('canvas');

function drawSprite(sprite: Sprite, canvas2d: CanvasRenderingContext2D | null | undefined) {
  if (!canvas2d || !sprite) return;

  const { assets, size, position } = sprite;

  const assetImg = new Image();
  assetImg.src = assets.idle;
  assetImg.width = size;
  assetImg.height = size;

  canvas2d.drawImage(assetImg, position.x, position.y, size, size);
}

function drawSprites() {
  for (const username in sprites) {
    drawSprite(sprites[username], canvas?.value?.getContext('2d'));
  }
}

onMounted(drawSprites);
watch(() => messages.length, drawSprites, { immediate: true });
</script>

<template>
  <div ref="footer">
    <canvas
      id="sprite-canvas"
      ref="canvas"
    />
  </div>
  <img src="/public/sprites/squooshme.avif"
</template>

<style lang="scss">
#sprite-canvas {
  width: 100%;
}
</style>
