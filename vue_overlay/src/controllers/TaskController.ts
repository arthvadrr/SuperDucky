import { socket } from '@/socket';
import {
  setTasks,
  addTask,
  removeTaskByUsername,
  updateTaskLikes,
  markTaskCompleted,
} from '@/stores/tasks';
import type { Task } from '@/types/Task';

socket.on('tasks:init', (taskList: Task[]): void => {
  setTasks(taskList);
});

socket.on('tasks:created', (task: Task): void => {
  addTask(task);
});

socket.on('tasks:completed', (task: Task): void => {
  markTaskCompleted(task);
});

socket.on('tasks:liked', (data: { username: string; likes: number }): void => {
  updateTaskLikes(data.username, data.likes);
});

socket.on('tasks:deleted', (data: { username: string }): void => {
  removeTaskByUsername(data.username);
});

socket.emit('tasks:request');
