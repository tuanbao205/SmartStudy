export interface Schedule {
  id: number;
  courseId: number;
  courseName: string;
  dayOfWeek: number; // 1=T2 ... 7=CN
  startTime: string; // "08:00:00"
  endTime: string;
  room?: string;
  startDate?: string | null; // "2026-08-01"
  endDate?: string | null;
}