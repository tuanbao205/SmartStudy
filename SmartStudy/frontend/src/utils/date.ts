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
export function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=CN..6=T7
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function dateToDayOfWeek(d: Date): number {
  const day = d.getDay();
  return day === 0 ? 7 : day;
}

export function formatWeekRangeVN(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = `${start.getDate()}`;
  const endStr = sameMonth
    ? `${end.getDate()} tháng ${end.getMonth() + 1}`
    : `${end.getDate()} tháng ${end.getMonth() + 1}`;
  return sameMonth
    ? `${startStr} - ${endStr}, ${end.getFullYear()}`
    : `${startStr} tháng ${start.getMonth() + 1} - ${endStr}, ${end.getFullYear()}`;
}