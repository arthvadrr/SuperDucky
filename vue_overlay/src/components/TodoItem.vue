<script setup lang="ts">
import type { Task } from '@/types/Task';

defineProps<{
  task: Task;
}>();
</script>

<template>
  <li class="todo-item">
    <div class="task-content">
      <span class="username">{{ task.username }}</span>
      <span class="task-name">{{ task.task_name }}</span>
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
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.username {
  font-size: 0.75em;
  color: #ffd94e;
  font-weight: 600;
}

.task-name {
  font-size: 0.9em;
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
