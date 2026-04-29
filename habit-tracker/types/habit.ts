export interface Habit {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  completions: string[]; // ISO date strings (YYYY-MM-DD)
}
