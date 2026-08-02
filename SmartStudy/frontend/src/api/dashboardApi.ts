import axiosClient from './axiosClient';
import type { DashboardData } from '../types/dashboard';

export const dashboardApi = {
  getDashboard: () => axiosClient.get<DashboardData>('/dashboard'),
};