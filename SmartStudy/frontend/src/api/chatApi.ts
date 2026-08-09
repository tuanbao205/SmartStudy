import axiosClient from './axiosClient';
import type { ChatResponse } from '../types/chat';

export const chatApi = {
  ask: (question: string) => axiosClient.post<ChatResponse>('/chat/ask', { question }),
};