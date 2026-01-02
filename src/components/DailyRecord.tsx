import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { Habit } from '../lib/types';
import { createDailyRecord, createCompletion } from '../lib/db';
import { calculateDailyScore } from '../lib/scoring';

interface DailyRecordProps {
  monthId: string;
  habits: Habit[];
  onRecorded: () => void;
}

export function DailyRecord({ monthId, habits, onRecorded }: DailyRecordProps) {
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [values, setValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleToggle = (habitId: string) => {
    setCompletions({
      ...completions,
      [habitId]: !completions[habitId],
    });
  };

  const handleValueChange = (habitId: string, value: string) => {
    const num = parseFloat(value);
    setValues({
      ...values,
      [habitId]: isNaN(num) ? 0 : num,
    });
  };

  const handleSubmit = async () => {
    setIsRecording(true);

    const completionsList = habits.map((habit) => ({
      habit_id: habit.id,
      completed: completions[habit.id] || false,
      value: values[habit.id],
    }));

    const score = calculateDailyScore(habits, completionsList.map(c => ({
      id: '',
      daily_record_id: '',
      habit_id: c.habit_id,
      completed: c.completed,
      value: c.value || null,
      created_at: '',
    })));

    const today = new Date().toISOString().split('T')[0];
    const record = await createDailyRecord(monthId, today, score, notes);

    if (record) {
      for (const completion of completionsList) {
        await createCompletion(
          record.id,
          completion.habit_id,
          completion.completed,
          completion.value
        );
      }
      onRecorded();
    }

    setIsRecording(false);
  };

  const scoringHabits = habits.filter((h) => h.is_scoring);
  const metricHabits = habits.filter((h) => !h.is_scoring);
  const completedCount = scoringHabits.filter((h) => completions[h.id]).length;
  const currentScore =
    scoringHabits.length > 0
      ? Math.round((completedCount / scoringHabits.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-light tracking-tight mb-2">{today}</h1>
          <p className="text-neutral-400 text-sm">Reality capture</p>
        </div>

        <div className="mb-8 bg-neutral-800 border border-neutral-700 p-6 rounded">
          <div className="text-center">
            <div className="text-5xl font-light mb-2">{currentScore}</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">
              Current score
            </div>
          </div>
        </div>

        {scoringHabits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
              Scoring habits
            </h2>
            <div className="space-y-2">
              {scoringHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => handleToggle(habit.id)}
                  className={`w-full p-4 rounded border flex items-center justify-between transition-colors ${
                    completions[habit.id]
                      ? 'bg-neutral-800 border-neutral-600'
                      : 'bg-neutral-900 border-neutral-700'
                  }`}
                >
                  <span>{habit.name}</span>
                  <div
                    className={`w-6 h-6 rounded border flex items-center justify-center ${
                      completions[habit.id]
                        ? 'bg-neutral-100 border-neutral-100'
                        : 'border-neutral-600'
                    }`}
                  >
                    {completions[habit.id] && <Check size={16} className="text-neutral-900" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {metricHabits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
              Metrics
            </h2>
            <div className="space-y-2">
              {metricHabits.map((habit) => (
                <div key={habit.id} className="bg-neutral-800 border border-neutral-700 p-4 rounded">
                  <label className="block text-sm mb-2">{habit.name}</label>
                  <input
                    type="number"
                    value={values[habit.id] || ''}
                    onChange={(e) => handleValueChange(habit.id, e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-neutral-100 focus:outline-none focus:border-neutral-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
            Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional context"
            rows={3}
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isRecording}
          className="w-full bg-neutral-100 text-neutral-900 py-3 rounded font-medium hover:bg-neutral-200 disabled:opacity-50"
        >
          {isRecording ? 'Recording...' : 'Record day'}
        </button>
      </div>
    </div>
  );
}
