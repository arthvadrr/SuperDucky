<script setup lang="ts">
import DurationBar from '@/components/DurationBar.vue';
import { EXCERPT_DURATION } from '@/util/constants.ts';
import type { Excerpt } from '@/types/Excerpt.ts';

defineProps<{ excerpt: Excerpt; isVisible: boolean }>();
</script>

<template>
  <div
    :class="{
      'lore-excerpt': true,
      'is-visible': isVisible,
    }"
  >
    <DurationBar
      :duration="EXCERPT_DURATION"
      :key="excerpt?.id"
    />
    <div class="lore-inner">
      <blockquote>"{{ excerpt?.book_excerpt ?? '' }}"</blockquote>
      <cite>
        <span>{{ excerpt?.book_title ?? '' }}&comma;</span> by
        <span
          >{{ excerpt?.book_author ?? '' }} ({{
            excerpt?.book_author_race ?? ''
          }})&comma;&nbsp;</span
        >
        <span>{{ excerpt?.book_author_role ?? '' }}</span>
      </cite>
    </div>
  </div>
</template>

<style lang="scss">
.lore-excerpt {
  visibility: hidden;
  position: absolute;
  background-color: #fff;
  box-shadow: 5px 5px 1px #000;
  border: 1px solid #000;
  border-radius: 10px;
  margin: 10px;
  overflow: hidden;
  letter-spacing: -1px;
  line-height: 1.5;
  transform: translateX(100%) rotate(-90deg);
  transition: 600ms cubic-bezier(0.68, -0.55, 0.27, 1.55);

  &.is-visible {
    visibility: visible;
    position: relative;
    transform: translateX(0) rotate(0);
  }

  .lore-inner {
    padding: 12px;

    blockquote {
      margin: 0 0 12px;
    }

    cite {
      font-style: italic;
    }
  }
}
</style>
