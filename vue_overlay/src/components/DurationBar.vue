<script setup lang="ts">
const { duration, height = 10 } = defineProps<{ duration: number; height: number }>();
</script>

<template>
  <div
    class="duration-bar"
    :style="{ height: `${height}px` }"
  >
    <div
      class="bar"
      :style="{ animationDuration: `${duration ?? 0}ms` }"
    />
  </div>
</template>

<style lang="scss">
.duration-bar {
  position: relative;
  width: 100%;
  background-color: #18181a;
  overflow: hidden;

  .bar {
    position: absolute;
    height: 100%;
    width: 100%;
    left: -100%;
    background-image: linear-gradient(to right, #df8926, #f6d35b);
    animation-name: durationBar;
    animation-timing-function: linear;
  }
}

@keyframes durationBar {
  from {
    left: 0;
  }
  to {
    left: -100%;
  }
}
</style>
