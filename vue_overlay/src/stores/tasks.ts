import { reactive } from 'vue';
import type { Task } from '@/types/Task';

export const tasks: Task[] = reactive([]);

/**
 * Tracks completed task counts per user for the current session.
 * This persists even after completed tasks are purged from the tasks array.
 */
export const completedCounts: Map<string, number> = reactive(new Map());

export function setTasks(newTasks: Task[]): void {
  tasks.splice(0, tasks.length, ...newTasks);
}

export function addTask(task: Task): void {
  const existingIndex = tasks.findIndex((t) => t.id === task.id);

  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
}

export function markTaskCompleted(task: Task): void {
  const existingIndex = tasks.findIndex((t) => t.id === task.id);
  const currentCount = completedCounts.get(task.username) ?? 0;

  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
    completedCounts.set(task.username, currentCount + 1);
  }
}

export function removeTaskByUsername(username: string): void {
  let index = tasks.findIndex((t) => t.username === username && t.completed_at);

  if (index < 0) {
    index = tasks.findIndex((t) => t.username === username);
  }

  if (index >= 0) {
    tasks.splice(index, 1);
  }
}

export function updateTaskLikes(username: string, likes: number): void {
  const task = tasks.find((t) => t.username === username && !t.completed_at);

  if (task) {
    task.likes = likes;
  }
}

export function hasActiveTask(username: string): boolean {
  return tasks.some((t) => t.username === username && !t.completed_at);
}

export function getCompletedTasksCount(username: string): number {
  return completedCounts.get(username) ?? 0;
}

export default tasks;
