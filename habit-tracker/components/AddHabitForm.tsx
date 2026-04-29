"use client";

import { useState } from "react";

interface Props {
  onAdd: (name: string) => void;
}

export default function AddHabitForm({ onAdd }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New habit (e.g. Read 30 min)"
        className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Add
      </button>
    </form>
  );
}
