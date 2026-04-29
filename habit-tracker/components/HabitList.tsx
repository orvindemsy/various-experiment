"use client";

import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

interface Props {
  habits: (Habit & { completedToday: boolean; streak: number })[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitList({ habits, onToggle, onDelete }: Props) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 py-16 text-center">
        <span className="text-4xl mb-3">✅</span>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No habits yet. Add one above to get started.
        </p>
      </div>
    );
  }

  const pending = habits.filter((h) => !h.completedToday);
  const done = habits.filter((h) => h.completedToday);

  return (
    <div className="flex flex-col gap-3">
      {pending.map((h) => (
        <HabitCard key={h.id} habit={h} onToggle={onToggle} onDelete={onDelete} />
      ))}
      {done.length > 0 && pending.length > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 px-1 pt-2">Completed today</p>
      )}
      {done.map((h) => (
        <HabitCard key={h.id} habit={h} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
