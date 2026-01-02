import type { Habit, HabitCompletion } from './types';

export function calculateDailyScore(
  habits: Habit[],
  completions: HabitCompletion[]
): number {
  const scoringHabits = habits.filter((h) => h.is_scoring);

  if (scoringHabits.length === 0) return 0;

  const completedCount = scoringHabits.filter((habit) => {
    const completion = completions.find((c) => c.habit_id === habit.id);
    return completion?.completed === true;
  }).length;

  return Math.round((completedCount / scoringHabits.length) * 100);
}

export function calculateStreak(
  records: Array<{ date: string; recorded: boolean; score: number }>,
  thresholdScore: number = 70
): number {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  for (const record of sortedRecords) {
    if (!record.recorded || record.score < thresholdScore) {
      break;
    }
    streak++;
  }

  return streak;
}

export function calculateLifelinePoints(
  records: Array<{ date: string; recorded: boolean; score: number }>
): Array<{ date: string; value: number }> {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const points: Array<{ date: string; value: number }> = [];
  let currentValue = 50;

  for (const record of sortedRecords) {
    if (!record.recorded) {
      currentValue = Math.max(0, currentValue - 5);
    } else {
      const delta = (record.score - 50) / 10;
      currentValue = Math.max(0, Math.min(100, currentValue + delta));
    }

    points.push({
      date: record.date,
      value: currentValue,
    });
  }

  return points;
}
