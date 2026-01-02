import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import type { DailyRecord } from '../lib/types';
import { Lifeline } from './Lifeline';
import { calculateStreak, calculateLifelinePoints } from '../lib/scoring';

interface DashboardProps {
  records: DailyRecord[];
  onNewRecord: () => void;
}

export function Dashboard({ records, onNewRecord }: DashboardProps) {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestRecord = sortedRecords[0];
  const streak = calculateStreak(records);
  const lifelinePoints = calculateLifelinePoints(records);

  const averageScore =
    records.length > 0
      ? Math.round(
          records.filter((r) => r.recorded).reduce((sum, r) => sum + r.score, 0) /
            records.filter((r) => r.recorded).length
        )
      : 0;

  const missedDays = records.filter((r) => !r.recorded).length;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = () => {
    if (records.length < 2) return <Activity size={20} className="text-neutral-500" />;

    const recent = sortedRecords.slice(0, 3).filter((r) => r.recorded);
    const older = sortedRecords.slice(3, 6).filter((r) => r.recorded);

    const recentAvg =
      recent.length > 0
        ? recent.reduce((sum, r) => sum + r.score, 0) / recent.length
        : 0;
    const olderAvg =
      older.length > 0
        ? older.reduce((sum, r) => sum + r.score, 0) / older.length
        : 0;

    if (recentAvg > olderAvg) {
      return <TrendingUp size={20} className="text-green-500" />;
    } else if (recentAvg < olderAvg) {
      return <TrendingDown size={20} className="text-red-500" />;
    }
    return <Activity size={20} className="text-neutral-500" />;
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight mb-2">
              Discipline Telemetry
            </h1>
            <p className="text-neutral-400 text-sm">Behavioral measurement system</p>
          </div>
          <button
            onClick={onNewRecord}
            className="bg-neutral-100 text-neutral-900 px-6 py-2 rounded font-medium hover:bg-neutral-200"
          >
            Record today
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-800 border border-neutral-700 p-6 rounded">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Latest score
            </div>
            <div className={`text-4xl font-light ${getScoreColor(latestRecord?.score || 0)}`}>
              {latestRecord?.score || 0}
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 p-6 rounded">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Current streak
            </div>
            <div className="text-4xl font-light text-neutral-100">{streak}</div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 p-6 rounded">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Average score
            </div>
            <div className={`text-4xl font-light ${getScoreColor(averageScore)}`}>
              {averageScore}
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 p-6 rounded">
            <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
              Trajectory
            </div>
            <div className="text-4xl font-light flex items-center">
              {getTrendIcon()}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Lifeline points={lifelinePoints} />
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded p-6">
          <h2 className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
            Recent records
          </h2>
          <div className="space-y-2">
            {sortedRecords.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 rounded"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-neutral-400">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {!record.recorded && (
                    <span className="text-xs text-red-500 uppercase tracking-wider">
                      Missed
                    </span>
                  )}
                </div>
                {record.recorded && (
                  <div className={`text-2xl font-light ${getScoreColor(record.score)}`}>
                    {record.score}
                  </div>
                )}
              </div>
            ))}
          </div>
          {missedDays > 0 && (
            <div className="mt-4 p-3 bg-red-950 border border-red-900 rounded">
              <span className="text-sm text-red-400">
                {missedDays} missed {missedDays === 1 ? 'day' : 'days'} this month
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
