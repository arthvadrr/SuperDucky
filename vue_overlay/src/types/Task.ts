export interface Task {
  id: number;
  username: string;
  task_name: string;
  likes: number;
  created_at: string;
  completed_at: string | null;
}
