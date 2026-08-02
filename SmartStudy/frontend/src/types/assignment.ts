export interface Assignment {
  id: number;
  courseId: number;
  courseName: string;
  title: string;
  description?: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  estimatedHours?: number;
}