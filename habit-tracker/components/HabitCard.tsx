"use client";

import { Habit } from "@/types/habit";

interface Props {
  habit: Habit & { completedToday: boolean; streak: number };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: Props) {
  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
        habit.completedToday
          ? "border-violet-400 bg-violet-50 dark:bg-violet-950/40 dark:border-violet-700"
          : "border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-700"
      }`}
    >
      <button
        onClick={() => onToggle(habit.id)}
        aria-label={habit.completedToday ? "Mark incomplete" : "Mark complete"}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          habit.completedToday
            ? "border-violet-600 bg-violet-600 text-white"
            : "border-zinc-300 dark:border-zinc-600 hover:border-violet-400"
        }`}
      >
        {habit.completedToday && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <span
        className={`flex-1 text-sm font-medium ${
          habit.completedToday
            ? "text-violet-700 dark:text-violet-300 line-through decoration-violet-400"
            : "text-zinc-800 dark:text-zinc-100"
        }`}
      >
        {habit.name}
      </span>

      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
        <span>🔥</span>
        <span>{habit.streak}</span>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        aria-label="Delete habit"
        className="ml-1 text-zinc-300 hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-400 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
