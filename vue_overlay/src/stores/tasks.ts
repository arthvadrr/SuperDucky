import { reactive } from 'vue';
import type { Task } from '@/types/Task';

export const tasks: Task[] = reactive([]);

export function setTasks(newTasks: Task[]): void {
  tasks.splice(0, tasks.length, ...newTasks);
}

export function addTask(task: Task): void {
  const existingIndex = tasks.findIndex((t) => t.username === task.username);
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
}

export function removeTask(username: string): void {
  const index = tasks.findIndex((t) => t.username === username);
  if (index >= 0) {
    tasks.splice(index, 1);
  }
}

export function updateTaskLikes(username: string, likes: number): void {
  const task = tasks.find((t) => t.username === username);
  if (task) {
    task.likes = likes;
  }
}

export default tasks;
