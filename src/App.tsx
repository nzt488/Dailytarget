import { useEffect, useState } from 'react';
import type { Month, Habit, DailyRecord } from './lib/types';
import {
  getCurrentMonth,
  createMonth,
  getMonthHabits,
  getMonthRecords,
  getTodayRecord,
} from './lib/db';
import { supabase } from './lib/supabase';
import { MonthSetup } from './components/MonthSetup';
import { DailyRecord as DailyRecordComponent } from './components/DailyRecord';
import { Dashboard } from './components/Dashboard';

type ViewMode = 'loading' | 'setup' | 'record' | 'dashboard';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('loading');
  const [currentMonth, setCurrentMonth] = useState<Month | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<DailyRecord[]>([]);

  const loadData = async () => {
    const now = new Date();
    let month = await getCurrentMonth();

    if (!month) {
      month = await createMonth(now.getFullYear(), now.getMonth() + 1);
    }

    if (!month) {
      setViewMode('loading');
      return;
    }

    setCurrentMonth(month);
    const monthHabits = await getMonthHabits(month.id);
    setHabits(monthHabits);

    const monthRecords = await getMonthRecords(month.id);
    setRecords(monthRecords);

    if (!month.locked && monthHabits.length === 0) {
      setViewMode('setup');
    } else {
      const todayRecord = await getTodayRecord(month.id);
      if (!todayRecord) {
        setViewMode('record');
      } else {
        setViewMode('dashboard');
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMonthSetupComplete = async () => {
    if (!currentMonth) return;

    await supabase
      .from('months')
      .update({ locked: true })
      .eq('id', currentMonth.id);

    setViewMode('record');
  };

  const handleRecordComplete = async () => {
    await loadData();
  };

  const handleNewRecord = () => {
    setViewMode('record');
  };

  if (viewMode === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-400">Initializing system...</div>
      </div>
    );
  }

  if (viewMode === 'setup' && currentMonth) {
    return (
      <MonthSetup
        month={currentMonth}
        habits={habits}
        onComplete={handleMonthSetupComplete}
      />
    );
  }

  if (viewMode === 'record' && currentMonth) {
    return (
      <DailyRecordComponent
        monthId={currentMonth.id}
        habits={habits}
        onRecorded={handleRecordComplete}
      />
    );
  }

  if (viewMode === 'dashboard') {
    return (
      <Dashboard
        records={records}
        onNewRecord={handleNewRecord}
      />
    );
  }

  return null;
}

export default App;
