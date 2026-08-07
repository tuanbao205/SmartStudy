export interface GradeComponent {
  id: number;
  courseId: number;
  name: string;
  weight: number;
}

export interface GradeDetail {
  componentName: string;
  weight: number;
  score: number | null;
}

export interface CourseGrade {
  courseId: number;
  courseName: string;
  details: GradeDetail[];
  totalScore: number | null;
}

export interface CourseGradeSummary {
  courseId: number;
  courseName: string;
  credits: number | null;
  totalScore: number | null;
  gpa4Scale: number | null;
}

export interface GpaData {
  gpa: number | null;
  gpa4Scale: number | null;
  courseSummaries: CourseGradeSummary[];
}