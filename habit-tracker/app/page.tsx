"use client";

import AddHabitForm from "@/components/AddHabitForm";
import HabitList from "@/components/HabitList";
import { useHabits } from "@/hooks/useHabits";

export default function Home() {
  const { habits, loaded, addHabit, deleteHabit, toggleToday } = useHabits();

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Habit Tracker
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {totalCount > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              <span>
                {completedCount} / {totalCount} today
              </span>
              <span>{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <AddHabitForm onAdd={addHabit} />
        </div>

        {!loaded ? (
          <div className="text-sm text-zinc-400 text-center py-10">Loading…</div>
        ) : (
          <HabitList habits={habits} onToggle={toggleToday} onDelete={deleteHabit} />
        )}
      </div>
    </main>
  );
}
