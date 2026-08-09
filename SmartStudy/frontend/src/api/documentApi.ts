import axiosClient from './axiosClient';
import type { DocumentItem } from '../types/document';

export const documentApi = {
  getMyDocuments: () => axiosClient.get<DocumentItem[]>('/documents'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post<DocumentItem>('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getViewUrl: (id: number) => {
    const token = localStorage.getItem('accessToken');
    return `http://localhost:8080/api/documents/${id}/view?token=${token}`;
  },
  delete: (id: number) => axiosClient.delete(`/documents/${id}`),
};