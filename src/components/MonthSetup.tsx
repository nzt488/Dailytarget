import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Month, Habit } from '../lib/types';
import { createHabit } from '../lib/db';

interface MonthSetupProps {
  month: Month;
  habits: Habit[];
  onComplete: () => void;
}

export function MonthSetup({ month, habits, onComplete }: MonthSetupProps) {
  const [habitName, setHabitName] = useState('');
  const [isScoring, setIsScoring] = useState(true);
  const [localHabits, setLocalHabits] = useState(habits);

  const handleAddHabit = async () => {
    if (!habitName.trim()) return;

    const newHabit = await createHabit(
      month.id,
      habitName,
      isScoring,
      localHabits.length
    );

    if (newHabit) {
      setLocalHabits([...localHabits, newHabit]);
      setHabitName('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight mb-2">
            {new Date(month.year, month.month - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h1>
          <p className="text-neutral-400 text-sm">Define monthly structure</p>
        </div>

        <div className="space-y-4 mb-8">
          {localHabits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between bg-neutral-800 border border-neutral-700 p-4 rounded"
            >
              <div>
                <span className="text-neutral-100">{habit.name}</span>
                <span className="ml-3 text-xs text-neutral-500">
                  {habit.is_scoring ? 'SCORING' : 'METRIC'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded space-y-4">
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
            placeholder="Habit name"
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
          />

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={isScoring}
                onChange={() => setIsScoring(true)}
                className="text-neutral-100"
              />
              <span>Scoring</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                checked={!isScoring}
                onChange={() => setIsScoring(false)}
                className="text-neutral-100"
              />
              <span>Metric only</span>
            </label>
          </div>

          <button
            onClick={handleAddHabit}
            className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-100 py-2 rounded flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>Add habit</span>
          </button>
        </div>

        {localHabits.length > 0 && (
          <button
            onClick={onComplete}
            className="mt-8 w-full bg-neutral-100 text-neutral-900 py-3 rounded font-medium hover:bg-neutral-200"
          >
            Lock structure and begin
          </button>
        )}
      </div>
    </div>
  );
}
