import { supabase } from './supabase';
import type { Month, Habit, DailyRecord, HabitCompletion } from './types';

export async function getCurrentMonth(): Promise<Month | null> {
  const now = new Date();
  const { data } = await supabase
    .from('months')
    .select('*')
    .eq('year', now.getFullYear())
    .eq('month', now.getMonth() + 1)
    .maybeSingle();

  return data;
}

export async function createMonth(year: number, month: number): Promise<Month | null> {
  const { data } = await supabase
    .from('months')
    .insert({ year, month, locked: false })
    .select()
    .single();

  return data;
}

export async function getMonthHabits(monthId: string): Promise<Habit[]> {
  const { data } = await supabase
    .from('habits')
    .select('*')
    .eq('month_id', monthId)
    .order('sort_order');

  return data || [];
}

export async function createHabit(
  monthId: string,
  name: string,
  isScoring: boolean,
  sortOrder: number
): Promise<Habit | null> {
  const { data } = await supabase
    .from('habits')
    .insert({ month_id: monthId, name, is_scoring: isScoring, sort_order: sortOrder })
    .select()
    .single();

  return data;
}

export async function getMonthRecords(monthId: string): Promise<DailyRecord[]> {
  const { data } = await supabase
    .from('daily_records')
    .select('*')
    .eq('month_id', monthId)
    .order('date');

  return data || [];
}

export async function createDailyRecord(
  monthId: string,
  date: string,
  score: number,
  notes: string = ''
): Promise<DailyRecord | null> {
  const { data } = await supabase
    .from('daily_records')
    .insert({
      month_id: monthId,
      date,
      recorded: true,
      score,
      notes,
      recorded_at: new Date().toISOString(),
    })
    .select()
    .single();

  return data;
}

export async function getRecordCompletions(recordId: string): Promise<HabitCompletion[]> {
  const { data } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('daily_record_id', recordId);

  return data || [];
}

export async function createCompletion(
  recordId: string,
  habitId: string,
  completed: boolean,
  value?: number
): Promise<HabitCompletion | null> {
  const { data } = await supabase
    .from('habit_completions')
    .insert({
      daily_record_id: recordId,
      habit_id: habitId,
      completed,
      value: value ?? null,
    })
    .select()
    .single();

  return data;
}

export async function getTodayRecord(monthId: string): Promise<DailyRecord | null> {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('daily_records')
    .select('*')
    .eq('month_id', monthId)
    .eq('date', today)
    .maybeSingle();

  return data;
}
