export interface Database {
  public: {
    Tables: {
      months: {
        Row: {
          id: string;
          year: number;
          month: number;
          locked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          month: number;
          locked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          month?: number;
          locked?: boolean;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          month_id: string;
          name: string;
          is_scoring: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          month_id: string;
          name: string;
          is_scoring?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          month_id?: string;
          name?: string;
          is_scoring?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      daily_records: {
        Row: {
          id: string;
          month_id: string;
          date: string;
          recorded: boolean;
          score: number;
          notes: string;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          month_id: string;
          date: string;
          recorded?: boolean;
          score?: number;
          notes?: string;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          month_id?: string;
          date?: string;
          recorded?: boolean;
          score?: number;
          notes?: string;
          recorded_at?: string;
          created_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          daily_record_id: string;
          habit_id: string;
          completed: boolean;
          value: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          daily_record_id: string;
          habit_id: string;
          completed?: boolean;
          value?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          daily_record_id?: string;
          habit_id?: string;
          completed?: boolean;
          value?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Month = Database['public']['Tables']['months']['Row'];
export type Habit = Database['public']['Tables']['habits']['Row'];
export type DailyRecord = Database['public']['Tables']['daily_records']['Row'];
export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row'];
