import axiosClient from './axiosClient';
import type { Course } from '../types/course';

export interface CourseFormData {
  name: string;
  code?: string;
  credits?: number;
  lecturerName?: string;
  semester?: string;
  academicYear?: string;
  color?: string;
}

export const courseApi = {
  getMyCourses: () => axiosClient.get<Course[]>('/courses'),
  create: (data: CourseFormData) => axiosClient.post<Course>('/courses', data),
  update: (id: number, data: CourseFormData) => axiosClient.put<Course>(`/courses/${id}`, data),
  delete: (id: number) => axiosClient.delete(`/courses/${id}`),
};