import axiosClient from './axiosClient';
import type { Assignment } from '../types/assignment';

export const assignmentApi = {
  getMyAssignments: () => axiosClient.get<Assignment[]>('/assignments'),
};