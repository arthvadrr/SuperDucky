<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Task } from '@/types/Task';

const props = defineProps<{
  task: Task;
}>();

const now = ref(Date.now());
const isCompleted = computed(() => !!props.task.completed_at);
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Check if it already has a timezone (Z or +/-HH:MM)
 * Do SQL to JS YYYY-MM-DD HH:MM:SS -> YYYY-MM-DDTHH:MM:SSZ
 * If there is still no explicit timezone, treat it as UTC.
 */
function parseTime(time: string): number {
  let trimmedTime = time.trim();

  if (/[zZ]$/.test(trimmedTime) || /[+-]\d{2}:?\d{2}$/.test(trimmedTime)) {
    return new Date(trimmedTime).getTime();
  }

  if (trimmedTime.includes(' ') && !trimmedTime.includes('T')) {
    trimmedTime = trimmedTime.replace(' ', 'T');
  }

  trimmedTime = trimmedTime + 'Z';

  return new Date(trimmedTime).getTime();
}

function formatDuration(createdAt: string, completedAt: string | null): string {
  const start = parseTime(createdAt);
  const end = completedAt ? parseTime(completedAt) : now.value;
  const totalMinutes = Math.max(0, Math.floor((end - start) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

const duration = computed(() => formatDuration(props.task.created_at, props.task.completed_at));

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = Date.now();
  }, 60000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <li
    class="todo-item"
    :class="{ completed: isCompleted }"
  >
    <div class="task-content">
      <div class="task-header">
        <span class="username">{{ task.username }}</span>
        <span class="duration">
          <span
            v-if="isCompleted"
            class="checkmark"
            >✅</span
          >
          {{ duration }}
        </span>
      </div>
      <span
        class="task-name"
        :class="{ 'crossed-out': isCompleted }"
        >{{ task.task_name }}</span
      >
    </div>
    <div
      class="task-likes"
      v-if="task.likes > 0"
    >
      <span class="heart">❤️</span>
      <span class="count">{{ task.likes }}</span>
    </div>
  </li>
</template>

<style scoped lang="scss">
.todo-item {
  background: #222;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #333;
  transition: background 0.2s ease;

  &:hover {
    background: #282828;
  }

  &.completed {
    background: #1a2a1a;
    border-color: #2a4a2a;
    opacity: 0.8;
  }
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.username {
  font-size: 0.75em;
  color: #ffd94e;
  font-weight: 600;
}

.duration {
  font-size: 0.7em;
  color: #888;
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: 4px;
}

.checkmark {
  font-size: 0.9em;
}

.task-name {
  font-size: 0.9em;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.crossed-out {
    text-decoration: line-through;
    color: #888;
  }
}

.task-likes {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #2a2a2a;
  padding: 4px 8px;
  border-radius: 12px;
  margin-left: 8px;

  .heart {
    font-size: 0.8em;
  }

  .count {
    font-size: 0.8em;
    color: #ff6b6b;
    font-weight: 600;
  }
}
</style>
