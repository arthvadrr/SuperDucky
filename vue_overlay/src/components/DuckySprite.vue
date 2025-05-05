<script setup lang="ts">
import DuckySVG from '@/components/DuckySVG.vue';
import DurationBar from '@/components/DurationBar.vue';
import type { Sprite } from '@/stores/sprites.ts';

const { sprite } = defineProps<{
  sprite: Sprite;
}>();
</script>

<template>
  <div
    class="sprite-container"
    :style="{
      zIndex: sprite.state.key === 'talk' ? 100 : 1,
    }"
  >
    <div class="chat-bubble-container">
      <div
        :class="{
          'chat-bubble': true,
          visible: sprite.state.isShowingMessage,
        }"
      >
        <div
          class="chat-bubble-inner"
          v-if="sprite.state.isShowingMessage"
        >
          <DurationBar
            :duration="sprite.messages?.[0].readingLength"
            :height="5"
          />
          <p class="chat-bubble-message">{{ sprite.messages?.[0].messageText ?? '' }}</p>
        </div>
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
    <DuckySVG
      class="sprite"
      :style="{
        height: `${sprite.size}px`,
        width: `${sprite.size}px`,
        transform: `scaleX(${sprite.deltaX})`,
      }"
      :color="sprite.color"
      :username="sprite.username"
      :state="sprite.state.key"
      :size="sprite.size"
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
  will-change: transform;

  .nameplate-container {
    padding: 4px 12px;
    background-color: #18181c;
    margin-bottom: 8px;
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
      margin-bottom: 5px;
      color: #000000;
      background-color: #fff;
      box-shadow: 5px 5px 1px #000;
      border: 1px solid #000;
      border-radius: 10px 10px 10px 0;
      transform-origin: bottom left;
      transform: translateY(50px) rotate(45deg) scale(0.1);
      overflow: hidden;
      opacity: 0;

      &.visible {
        opacity: 1;
        transform: translateY(0);
        transition:
          transform 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55),
          opacity 300ms ease-in;
      }

      .chat-bubble-message {
        margin: 0;
        border-top: 1px solid #000;
        padding: 12px;
      }
    }
  }

  .sprite {
    position: relative;
    background-size: contain;
    background-position: bottom;
    background-repeat: no-repeat;
    mask-size: contain;
    mask-position: bottom;
    mask-repeat: no-repeat;
    background-blend-mode: color;
    transform-origin: center;

    .sprite-mask-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0.1;
    }
  }
}
</style>
