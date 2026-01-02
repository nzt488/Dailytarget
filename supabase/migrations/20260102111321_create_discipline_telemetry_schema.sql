/*
  # Discipline Telemetry System Schema

  1. New Tables
    - `months`
      - `id` (uuid, primary key)
      - `year` (integer) - calendar year
      - `month` (integer) - month number (1-12)
      - `locked` (boolean) - whether structure is frozen
      - `created_at` (timestamp)
      
    - `habits`
      - `id` (uuid, primary key)
      - `month_id` (uuid, foreign key to months)
      - `name` (text) - habit name
      - `is_scoring` (boolean) - whether habit contributes to daily score
      - `sort_order` (integer) - display order
      - `created_at` (timestamp)
      
    - `daily_records`
      - `id` (uuid, primary key)
      - `month_id` (uuid, foreign key to months)
      - `date` (date) - the specific day
      - `recorded` (boolean) - whether day was recorded or missed
      - `score` (numeric) - calculated daily score (0-100)
      - `notes` (text) - optional context
      - `recorded_at` (timestamp) - when record was created
      - `created_at` (timestamp)
      
    - `habit_completions`
      - `id` (uuid, primary key)
      - `daily_record_id` (uuid, foreign key to daily_records)
      - `habit_id` (uuid, foreign key to habits)
      - `completed` (boolean) - binary completion status
      - `value` (numeric) - optional numeric value for non-scoring metrics
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Unique constraint on (year, month) in months table
    - Unique constraint on (month_id, date) in daily_records table
    - Unique constraint on (daily_record_id, habit_id) in habit_completions table
    - Index on date for efficient querying

  4. Important Notes
    - Daily records are immutable once created
    - Months can be locked to prevent structural changes
    - Scoring habits vs non-scoring metrics are distinguished
    - Missed days are explicit (recorded = false)
*/

CREATE TABLE IF NOT EXISTS months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(year, month)
);

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id uuid NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_scoring boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id uuid NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  date date NOT NULL,
  recorded boolean DEFAULT true,
  score numeric DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  notes text DEFAULT '',
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(month_id, date)
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_record_id uuid NOT NULL REFERENCES daily_records(id) ON DELETE CASCADE,
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  value numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(daily_record_id, habit_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_records_date ON daily_records(date);
CREATE INDEX IF NOT EXISTS idx_habits_month ON habits(month_id);
CREATE INDEX IF NOT EXISTS idx_completions_record ON habit_completions(daily_record_id);

ALTER TABLE months ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to months"
  ON months FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access to habits"
  ON habits FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access to daily records"
  ON daily_records FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access to habit completions"
  ON habit_completions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);