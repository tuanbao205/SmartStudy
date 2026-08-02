export interface CalendarEvent {
  type: 'CLASS' | 'ASSIGNMENT';
  title: string;
  courseName: string;
  startTime: string;
  endTime: string | null;
  extraInfo: string;
}