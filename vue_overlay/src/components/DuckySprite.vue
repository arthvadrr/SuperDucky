<script setup lang="ts">
import { computed } from 'vue';
import { tasks, getCompletedTasksCount } from '@/stores/tasks';
import DuckySVG from '@/components/DuckySVG.vue';
import DurationBar from '@/components/DurationBar.vue';
import type { Sprite } from '@/stores/sprites.ts';

const props = defineProps<{
  sprite: Sprite;
}>();

interface EmojiTier {
  emoji: string;
  tier: number;
}

const TIER_LOOKUP: EmojiTier[][] = [
  [], // 0
  [{ emoji: '🥚', tier: 1 }], // 1
  [
    { emoji: '🥚', tier: 1 },
    { emoji: '🥚', tier: 1 },
  ], // 2
  [{ emoji: '🐣', tier: 2 }], // 3
  [
    { emoji: '🐣', tier: 2 },
    { emoji: '🥚', tier: 1 },
  ], // 4
  [
    { emoji: '🐣', tier: 2 },
    { emoji: '🐣', tier: 2 },
  ], // 5
  [{ emoji: '🐥', tier: 3 }], // 6
  [
    { emoji: '🐥', tier: 3 },
    { emoji: '🥚', tier: 1 },
  ], // 7
  [
    { emoji: '🐥', tier: 3 },
    { emoji: '🐣', tier: 2 },
  ], // 8
  [
    { emoji: '🐥', tier: 3 },
    { emoji: '🐥', tier: 3 },
  ], // 9
  [{ emoji: '🦆', tier: 4 }], // 10
  [
    { emoji: '🦆', tier: 4 },
    { emoji: '🥚', tier: 1 },
  ], // 11
  [
    { emoji: '🦆', tier: 4 },
    { emoji: '🐣', tier: 2 },
  ], // 12
  [
    { emoji: '🦆', tier: 4 },
    { emoji: '🐥', tier: 3 },
  ], // 13
  [
    { emoji: '🦆', tier: 4 },
    { emoji: '🦆', tier: 4 },
  ], // 14
  [{ emoji: '🐦‍🔥', tier: 5 }], // 15
  [
    { emoji: '🐦‍🔥', tier: 5 },
    { emoji: '🥚', tier: 1 },
  ], // 16
  [
    { emoji: '🐦‍🔥', tier: 5 },
    { emoji: '🐣', tier: 2 },
  ], // 17
  [
    { emoji: '🐦‍🔥', tier: 5 },
    { emoji: '🐥', tier: 3 },
  ], // 18
  [
    { emoji: '🐦‍🔥', tier: 5 },
    { emoji: '🦆', tier: 4 },
  ], // 19
  [
    { emoji: '🐦‍🔥', tier: 5 },
    { emoji: '🐦‍🔥', tier: 5 },
  ], // 20
];

function getNextTiers(completedCount: number): EmojiTier[] {
  if (completedCount >= 21) {
    return [{ emoji: '👑', tier: 6 }];
  }

  if (completedCount === 20) {
    return [{ emoji: '👑', tier: 6 }];
  }

  return TIER_LOOKUP[completedCount + 1] ?? [];
}

const nameplateTiers = computed((): EmojiTier[] => {
  const username = props.sprite.username;
  const completedCount = getCompletedTasksCount(username);
  const hasActive = tasks.some((t) => t.username === username && !t.completed_at);

  const tiers: EmojiTier[] = [];

  if (completedCount >= 21) {
    tiers.push({ emoji: '👑', tier: 6 });

    if (hasActive) {
      tiers.push({ emoji: '🔥', tier: 6 });
    }
  } else if (completedCount > 0 && TIER_LOOKUP[completedCount]) {
    const currentTiers = TIER_LOOKUP[completedCount];
    const nextTiers = getNextTiers(completedCount);

    if (hasActive) {
      if (completedCount === 20) {
        tiers.push({ emoji: '🔥', tier: 6 });
        tiers.push({ emoji: '🔥', tier: 6 });
      } else if ([2, 5, 9, 14].includes(completedCount)) {
        tiers.push({ emoji: '🔥', tier: nextTiers[0]?.tier ?? 0 });

        if (currentTiers[1]) {
          tiers.push(currentTiers[1]);
        }
      } else if (currentTiers.length === 1) {
        if (currentTiers[0]) {
          tiers.push(currentTiers[0]);
        }

        tiers.push({ emoji: '🔥', tier: nextTiers[1]?.tier ?? nextTiers[0]?.tier ?? 0 });
      } else {
        if (currentTiers[0]) {
          tiers.push(currentTiers[0]);
        }
        tiers.push({ emoji: '🔥', tier: nextTiers[1]?.tier ?? 0 });
      }
    } else {
      tiers.push(...currentTiers);
    }
  } else if (hasActive) {
    // With 0 completions, the next tier is the first egg.
    tiers.push({ emoji: '🔥', tier: getNextTiers(0)[0]?.tier ?? 0 });
  }

  return tiers;
});

const hasPrefix = computed(() => nameplateTiers.value.length > 0);
const isMegaDucky = computed(() => getCompletedTasksCount(props.sprite.username) >= 21);

const spriteSize = computed(() => {
  if (isMegaDucky.value) {
    return 200;
  }

  return props.sprite.size;
});
</script>

<template>
  <div
    class="sprite-container"
    :style="{
      zIndex: props.sprite.state.key === 'talk' || props.sprite.state.isShowingMessage ? 100 : 1,
    }"
  >
    <div class="chat-bubble-container">
      <div
        :class="{
          'chat-bubble': true,
          visible: props.sprite.state.isShowingMessage,
        }"
      >
        <div
          class="chat-bubble-inner"
          v-if="props.sprite.state.isShowingMessage"
        >
          <DurationBar
            :duration="props.sprite.messages[0]!.readingLength"
            :height="5"
          />
          <p class="chat-bubble-message">{{ props.sprite.messages[0]!.messageText ?? '' }}</p>
        </div>
      </div>
    </div>
    <div class="nameplate-container">
      <div
        class="nameplate"
        :style="{
          color: props.sprite.color,
        }"
      >
        <span
          v-if="hasPrefix"
          class="nameplate-prefix"
          ><span
            v-for="(tierData, index) in nameplateTiers"
            :key="index"
            :class="`tier-${tierData.tier}`"
            >{{ tierData.emoji }}</span
          ></span
        >{{ props.sprite.username }}
      </div>
    </div>
    <DuckySVG
      class="sprite"
      :style="{
        height: `${spriteSize}px`,
        width: `${spriteSize}px`,
        transform: `scaleX(${props.sprite.deltaX})`,
      }"
      :color="props.sprite.color"
      :username="props.sprite.username"
      :state="props.sprite.state.key"
      :size="spriteSize"
      :isRunning="props.sprite.state.isRunning"
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

    .nameplate {
      display: flex;
      align-items: center;
    }

    .nameplate-prefix {
      margin-right: 4px;

      .tier-0 {
        font-size: 1rem;
      }

      .tier-1 {
        font-size: 1.2rem;
      }

      .tier-2 {
        font-size: 1.44rem;
      }

      .tier-3 {
        font-size: 1.73rem;
      }

      .tier-4 {
        font-size: 2.07rem;
      }

      .tier-5 {
        font-size: 2.49rem;
      }

      .tier-6 {
        font-size: 2.99rem;
      }
    }
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
    overflow: visible;

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
