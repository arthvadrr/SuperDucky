import { socket } from '@/socket';
import { setTasks, addTask, removeTask, updateTaskLikes } from '@/stores/tasks';
import type { Task } from '@/types/Task';

socket.on('tasks:init', (taskList: Task[]): void => {
  setTasks(taskList);
});

socket.on('tasks:created', (task: Task): void => {
  addTask(task);
});

socket.on('tasks:completed', (data: { username: string }): void => {
  removeTask(data.username);
});

socket.on('tasks:liked', (data: { username: string; likes: number }): void => {
  updateTaskLikes(data.username, data.likes);
});

socket.on('tasks:deleted', (data: { username: string }): void => {
  removeTask(data.username);
});

socket.emit('tasks:request');
