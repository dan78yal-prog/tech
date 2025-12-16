export enum DayOfWeek {
  SUNDAY = 'الأحد',
  MONDAY = 'الاثنين',
  TUESDAY = 'الثلاثاء',
  WEDNESDAY = 'الأربعاء',
  THURSDAY = 'الخميس',
}

export interface Student {
  id: string;
  name: string;
  notes: string;
  attendance: Record<string, 'present' | 'absent' | 'late' | 'excused'>; // key is date string YYYY-MM-DD
  participationScore: number; // 0-10
}

export interface ClassGroup {
  id: string;
  name: string;
  students: Student[];
}

export interface LessonPlan {
  id: string;
  subject: string;
  topic: string;
  objectives: string[];
  materials: string;
  content: string;
  homework: string;
  isGenerated: boolean;
}

export interface ScheduleSlot {
  id: string;
  day: DayOfWeek;
  period: number; // 1 to 7
  className: string;
  lessonPlan?: LessonPlan;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export type ViewMode = 'schedule' | 'classes' | 'tracker' | 'tasks' | 'reports';

export interface AIConfig {
  apiKey: string;
}