import db from './sqlite';

export interface Task {
  username: string;
  task_name: string;
  likes: number;
  created_at: string;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    username TEXT PRIMARY KEY,
    task_name TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export function createTask(username: string, taskName: string): Task | null {
  const existing = db.prepare('SELECT * FROM tasks WHERE username = ?').get(username);
  if (existing) return null;

  db.prepare('INSERT INTO tasks (username, task_name) VALUES (?, ?)').run(username, taskName);
  return db.prepare('SELECT * FROM tasks WHERE username = ?').get(username) as Task;
}

export function completeTask(username: string): Task | null {
  const task = db.prepare('SELECT * FROM tasks WHERE username = ?').get(username) as
    | Task
    | undefined;
  if (!task) return null;

  db.prepare('DELETE FROM tasks WHERE username = ?').run(username);
  return task;
}

export function likeTask(username: string): Task | null {
  const task = db.prepare('SELECT * FROM tasks WHERE username = ?').get(username) as
    | Task
    | undefined;
  if (!task) return null;

  db.prepare('UPDATE tasks SET likes = likes + 1 WHERE username = ?').run(username);
  return db.prepare('SELECT * FROM tasks WHERE username = ?').get(username) as Task;
}

export function deleteTask(username: string): Task | null {
  const task = db.prepare('SELECT * FROM tasks WHERE username = ?').get(username) as
    | Task
    | undefined;
  if (!task) return null;

  db.prepare('DELETE FROM tasks WHERE username = ?').run(username);
  return task;
}

export function getAllTasks(): Task[] {
  return db.prepare('SELECT * FROM tasks ORDER BY created_at ASC').all() as Task[];
}
