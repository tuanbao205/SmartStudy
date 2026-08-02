import axiosClient from './axiosClient';
import type { Course } from '../types/course';

export const courseApi = {
  getMyCourses: () => axiosClient.get<Course[]>('/courses'),
};