export interface DocumentItem {
  id: number;
  originalName: string;
  fileType: string;
  status: 'PROCESSING' | 'READY' | 'FAILED';
  uploadedAt: string;
}