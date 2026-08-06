import axiosClient from './axiosClient';
import type { Assignment } from '../types/assignment';

export interface AssignmentFormData {
  courseId: number;
  title: string;
  description?: string;
  deadline: string; // ISO datetime
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedHours?: number;
}

export const assignmentApi = {
  getMyAssignments: () => axiosClient.get<Assignment[]>('/assignments'),
  create: (data: AssignmentFormData) => axiosClient.post<Assignment>('/assignments', data),
  updateStatus: (id: number, status: string) =>
    axiosClient.patch<Assignment>(`/assignments/${id}/status`, { status }),
  delete: (id: number) => axiosClient.delete(`/assignments/${id}`),
};