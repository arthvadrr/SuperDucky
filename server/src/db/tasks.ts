import db from './sqlite';

export interface Task {
  id: number;
  username: string;
  task_name: string;
  likes: number;
  created_at: string;
  completed_at: string | null;
}

// SQLite CURRENT_TIMESTAMP is "YYYY-MM-DD HH:MM:SS" (UTC). Keep comparisons in the same format.
function toSqliteTimestamp(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * Check if we need to migrate from old schema (username as PRIMARY KEY)
 * and create the tasks table with the new schema if needed.
 */
const tableInfo = db.prepare('PRAGMA table_info(tasks)').all() as { name: string; pk: number }[];
const hasPkOnUsername = tableInfo.some((col) => col.name === 'username' && col.pk === 1);

if (hasPkOnUsername) {
  db.exec(`
    ALTER TABLE tasks RENAME TO tasks_old;
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      task_name TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT DEFAULT NULL
    );
    INSERT INTO tasks (username, task_name, likes, created_at, completed_at)
    SELECT username, task_name, likes, created_at, completed_at FROM tasks_old;
    DROP TABLE tasks_old;
  `);
} else {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      task_name TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT DEFAULT NULL
    )
  `);
}

export function createTask(username: string, taskName: string): Task | null {
  const existing = db
    .prepare('SELECT * FROM tasks WHERE username = ? AND completed_at IS NULL')
    .get(username);

  if (existing) {
    return null;
  }

  const result = db
    .prepare('INSERT INTO tasks (username, task_name) VALUES (?, ?)')
    .run(username, taskName);

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;
}

export function completeTask(username: string): Task | null {
  const task = db
    .prepare('SELECT * FROM tasks WHERE username = ? AND completed_at IS NULL')
    .get(username) as Task | undefined;

  if (!task) {
    return null;
  }

  const completedAt = toSqliteTimestamp(new Date());
  db.prepare('UPDATE tasks SET completed_at = ? WHERE id = ?').run(completedAt, task.id);

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id) as Task;
}

export function likeTask(username: string): Task | null {
  const task = db
    .prepare('SELECT * FROM tasks WHERE username = ? AND completed_at IS NULL')
    .get(username) as Task | undefined;

  if (!task) {
    return null;
  }

  db.prepare('UPDATE tasks SET likes = likes + 1 WHERE id = ?').run(task.id);

  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id) as Task;
}

export function deleteTask(username: string): Task | null {
  const task = db
    .prepare('SELECT * FROM tasks WHERE username = ? AND completed_at IS NULL')
    .get(username) as Task | undefined;

  if (!task) {
    return null;
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(task.id);

  return task;
}

export function getAllTasks(): Task[] {
  return db.prepare('SELECT * FROM tasks ORDER BY created_at ASC').all() as Task[];
}

export function getCompletedTasksCount(
  username: string,
  withinMs: number = 24 * 60 * 60 * 1000,
): number {
  const cutoff = toSqliteTimestamp(new Date(Date.now() - withinMs));
  const result = db
    .prepare(
      'SELECT COUNT(*) as count FROM tasks WHERE username = ? AND completed_at IS NOT NULL AND completed_at > ?',
    )
    .get(username, cutoff) as { count: number };

  return result.count;
}

export function purgeOldTasks(maxAgeMs: number = 8 * 60 * 60 * 1000): string[] {
  const cutoff = toSqliteTimestamp(new Date(Date.now() - maxAgeMs));
  const oldTasks = db
    .prepare('SELECT username FROM tasks WHERE completed_at IS NULL AND created_at < ?')
    .all(cutoff) as { username: string }[];

  if (oldTasks.length > 0) {
    db.prepare('DELETE FROM tasks WHERE completed_at IS NULL AND created_at < ?').run(cutoff);
  }

  return oldTasks.map((t) => t.username);
}

export function purgeCompletedTasks(maxAgeMs: number = 2 * 60 * 1000): string[] {
  const cutoff = toSqliteTimestamp(new Date(Date.now() - maxAgeMs));
  const completedTasks = db
    .prepare('SELECT username FROM tasks WHERE completed_at IS NOT NULL AND completed_at < ?')
    .all(cutoff) as { username: string }[];

  if (completedTasks.length > 0) {
    db.prepare('DELETE FROM tasks WHERE completed_at IS NOT NULL AND completed_at < ?').run(cutoff);
  }

  return completedTasks.map((t) => t.username);
}
