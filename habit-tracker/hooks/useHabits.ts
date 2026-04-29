"use client";

import { useState, useEffect, useCallback } from "react";
import { Habit } from "@/types/habit";

const STORAGE_KEY = "habit-tracker-habits";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort().reverse();
  let streak = 0;
  let cursor = new Date(todayStr());

  for (const d of sorted) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (d === dateStr) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHabits(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, loaded]);

  const addHabit = useCallback((name: string) => {
    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        completions: [],
      },
    ]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleToday = useCallback((id: string) => {
    const today = todayStr();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(today);
        return {
          ...h,
          completions: done
            ? h.completions.filter((d) => d !== today)
            : [...h.completions, today],
        };
      })
    );
  }, []);

  const habitsWithMeta = habits.map((h) => ({
    ...h,
    completedToday: h.completions.includes(todayStr()),
    streak: calcStreak(h.completions),
  }));

  return { habits: habitsWithMeta, loaded, addHabit, deleteHabit, toggleToday };
}
