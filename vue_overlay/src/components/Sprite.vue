<script setup lang="ts">
import { watch } from 'vue';
import type { Sprite } from '@/stores/sprites.ts';

const { sprite } = defineProps<{
  sprite: Sprite;
}>();

/**
 * If we don't have a timout going but we have messages, then we need to enqueue our message. Quack.
 */
watch(
  () => sprite.messages.length,
  () => {
    if (
      !sprite.state.isShowingMessage &&
      !sprite.state.isShowingMessageTimeout &&
      sprite.messages.length > 0
    ) {
      const readingLength: number = sprite.messages[0].split(' ').length * 500 + 5000;

      sprite.state.isShowingMessage = true;
      sprite.state.isShowingMessageTimeout = setTimeout(() => {
        sprite.state.isShowingMessage = false;
        sprite.state.isShowingMessageTimeout = setTimeout(() => {
          sprite.state.isShowingMessageTimeout = null;
          sprite.messages.shift();
        }, 1000);
      }, readingLength);
    }

    console.log('sprite', sprite);
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="sprite-container"
    :style="{
      left: `${sprite.position.x}px`,
    }"
  >
    <div class="chat-bubble-container">
      <div
        :class="{
          'chat-bubble': true,
          visible: sprite.state.isShowingMessage,
        }"
      >
        {{ sprite.messages?.[0] ?? '' }}
      </div>
    </div>
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
    <div
      class="sprite"
      :style="{
        width: `${Math.round(sprite.size)}px`,
        height: `${Math.round(sprite.size)}px`,
        transform: `scale(${sprite.deltaX}, 1)`,
        backgroundImage: `url(${sprite.assets[sprite.state.key]})`,
        filter: `hue-rotate(${sprite.hueRotate}deg)`
      }"
    />
  </div>
</template>

<style scoped lang="scss">
.sprite-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 0;

  .nameplate-container {
    padding: 2px 8px;
    background: rgba(#18181c, 0.85);
    font-size: 14px;
    margin-bottom: 8px;
    border: 1px solid #000;
    border-radius: 4px;
  }

  .chat-bubble-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    top: -610px;
    width: 400px;
    height: 600px;

  .chat-bubble {
    bottom: 0;
    width: fit-content;
    padding: 10px 20px;
    margin-bottom: 5px;
    color: #000000;
    background-color: #fff;
    box-shadow: 5px 5px 1px #000;
    border: 1px solid #000;
    border-radius: 15px 15px 15px 0;
    transform-origin: bottom left;
    transform: translateY(50px) rotate(45deg) scale(0.1);
    opacity: 0;

    &.visible {
      opacity: 1;
      transform: translateY(0);
      transition:
        transform 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55),
        opacity 300ms ease-in;
    }
  }
  }

  .sprite {
    position: relative;
    vertical-align: bottom;
    background-size: contain;
    background-position: bottom;
    background-repeat: no-repeat;
  }
}
</style>
