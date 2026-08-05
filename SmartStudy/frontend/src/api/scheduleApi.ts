import axiosClient from './axiosClient';
import type { Schedule } from '../types/schedule';

export interface ScheduleFormData {
  courseId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  startDate?: string;
  endDate?: string;
}

export const scheduleApi = {
  getMySchedules: () => axiosClient.get<Schedule[]>('/schedules'),
  create: (data: ScheduleFormData) => axiosClient.post<Schedule>('/schedules', data),
  delete: (id: number) => axiosClient.delete(`/schedules/${id}`),
};