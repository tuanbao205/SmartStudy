const weekdayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

export function formatFullDateVN(date: Date): string {
  return `${weekdayNames[date.getDay()]}, ${date.getDate()} tháng ${date.getMonth() + 1}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export function daysUntil(iso: string): number {
  const diffMs = new Date(iso).getTime() - new Date().getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}