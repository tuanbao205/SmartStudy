import axiosClient from './axiosClient';
import type { NotificationItem, UnreadCountResponse } from '../types/notification';

export const notificationApi = {
  getMy: () => axiosClient.get<NotificationItem[]>('/notifications'),
  getUnreadCount: () => axiosClient.get<UnreadCountResponse>('/notifications/unread-count'),
  markAsRead: (id: number) => axiosClient.patch(`/notifications/${id}/read`),
};