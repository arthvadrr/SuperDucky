<script setup lang="ts">
import { watch } from 'vue';
import sprites from '../stores/sprites';
import Sprite from './Sprite.vue';

console.log('sprite controller', sprites.value);

watch(
    sprites,
    () => {
      console.log('sprites changed');
    },
    { deep: true },
);
</script>

<template>
  <div class="sprites">
    <Sprite
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
