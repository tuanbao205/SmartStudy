import axiosClient from './axiosClient';
import type { GradeComponent, CourseGrade, GpaData } from '../types/grade';

export interface GradeComponentFormData {
  courseId: number;
  name: string;
  weight: number;
}

export const gradeApi = {
  getComponentsByCourse: (courseId: number) =>
    axiosClient.get<GradeComponent[]>(`/grade-components/course/${courseId}`),
  createComponent: (data: GradeComponentFormData) =>
    axiosClient.post<GradeComponent>('/grade-components', data),
  updateGrade: (gradeComponentId: number, score: number) =>
    axiosClient.put('/grades', { gradeComponentId, score }),
  getCourseGrade: (courseId: number) => axiosClient.get<CourseGrade>(`/grades/course/${courseId}`),
  getGpa: () => axiosClient.get<GpaData>('/grades/gpa'),
};