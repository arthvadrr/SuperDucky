<script setup lang="ts">
import { watch, ref } from 'vue';
import { EXCERPT_DELAY, EXCERPT_DURATION } from '@/util/constants.ts';
import excerpts from '@/stores/excerpts.ts';
import LoreExcerpt from '@/components/LoreExcerpt.vue';

const loreTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
const loreDelayTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

watch(
  () => [excerpts.length, loreTimeout.value, loreDelayTimeout.value],
  () => {
    if (excerpts.length > 0 && !loreTimeout.value && !loreDelayTimeout.value) {
      /**
       * Enqueue the excerpt
       */
      loreTimeout.value = setTimeout(() => {
        loreTimeout.value = null;

        /**
         * Sets the delay for next excerpt
         */
        loreDelayTimeout.value = setTimeout(() => {
          excerpts.shift();
          loreDelayTimeout.value = null;
        }, EXCERPT_DELAY);
      }, EXCERPT_DURATION);
    }
  },
);
</script>

<template>
  <div class="ducky-lore">
    <div class="excerpts">
      <LoreExcerpt :excerpt="excerpts[0]" :isVisible="!!(excerpts.length > 0 && loreTimeout)" />
    </div>
  </div>
</template>
