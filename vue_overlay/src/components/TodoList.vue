<script setup lang="ts">
import tasks from '@/stores/tasks';
import TodoItem from '@/components/TodoItem.vue';
</script>

<template>
  <div class="todo-list">
    <div class="todo-header">
      <span class="duck-icon">🐥</span>
      <h2>Tasks</h2>
    </div>
    <div class="todo-commands">
      <code>!task {name}</code>
      <code>!done</code>
      <code>!like {user}</code>
    </div>
    <ul
      class="tasks"
      v-if="tasks.length > 0"
    >
      <TodoItem
        v-for="task in tasks"
        :key="task.username"
        :task="task"
      />
    </ul>
    <div
      class="empty-state"
      v-else
    >
      <p>No tasks yet!</p>
      <p class="hint">Type <code>!task</code> in chat</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.todo-list {
  background: #1a1a1a;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-blend-mode: overlay;
  border-radius: 12px;
  padding: 16px;
  color: #e0e0e0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #2a2a2a;
}

.todo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;

  .duck-icon {
    font-size: 1.4em;
  }

  h2 {
    margin: 0;
    font-size: 1.1em;
    font-weight: 600;
    color: #ffd94e;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.todo-commands {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  code {
    background: #252525;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75em;
    color: #888;
    border: 1px solid #333;
  }
}

.tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-align: center;

  p {
    margin: 4px 0;
  }

  .hint {
    font-size: 0.85em;

    code {
      background: #252525;
      padding: 2px 6px;
      border-radius: 4px;
      color: #ffd94e;
    }
  }
}
</style>
