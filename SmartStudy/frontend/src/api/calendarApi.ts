import axiosClient from './axiosClient';
import type { CalendarEvent } from '../types/calendar';

export const calendarApi = {
  getCurrentWeek: () => axiosClient.get<CalendarEvent[]>('/calendar/current-week'),
};