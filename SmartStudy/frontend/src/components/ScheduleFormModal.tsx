import { useEffect, useState } from 'react';
import type { Course } from '../types/course';
import type { ScheduleFormData } from '../api/scheduleApi';

const dayOptions = [
  { value: 1, label: 'Thứ 2' },
  { value: 2, label: 'Thứ 3' },
  { value: 3, label: 'Thứ 4' },
  { value: 4, label: 'Thứ 5' },
  { value: 5, label: 'Thứ 6' },
  { value: 6, label: 'Thứ 7' },
  { value: 7, label: 'Chủ nhật' },
];

interface Props {
  open: boolean;
  courses: Course[];
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => Promise<void>;
}

export default function ScheduleFormModal({ open, courses, onClose, onSubmit }: Props) {
  const [courseId, setCourseId] = useState<number | ''>('');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('09:00');
  const [room, setRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCourseId(courses[0]?.id ?? '');
      setDayOfWeek(1);
      setStartTime('07:00');
      setEndTime('09:00');
      setRoom('');
      setStartDate('');
      setEndDate('');
      setError('');
    }
  }, [open, courses]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      setError('Vui lòng chọn môn học');
      return;
    }
    if (startTime >= endTime) {
      setError('Giờ bắt đầu phải trước giờ kết thúc');
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      setError('Ngày bắt đầu phải trước ngày kết thúc');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        courseId: Number(courseId),
        dayOfWeek,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        room: room || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">Thêm lịch học</h2>
          <button onClick={onClose} className="text-muted hover:text-ink transition text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Môn học *
            </label>
            {courses.length === 0 ? (
              <p className="text-sm text-muted">Bạn chưa có môn học nào, hãy thêm môn học trước.</p>
            ) : (
              <select
                value={courseId}
                onChange={(e) => setCourseId(Number(e.target.value))}
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Thứ trong tuần
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            >
              {dayOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Giờ kết thúc
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Phòng học
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="A101"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            />
          </div>

          <div className="border-t border-ink/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Áp dụng trong khoảng (không bắt buộc)
            </p>
            <p className="text-xs text-muted mb-2.5">
              Để trống nếu lịch học lặp lại vĩnh viễn, không giới hạn theo học kỳ.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
                />
              </div>
            </div>
          </div>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-ink/15 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 transition"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={saving || courses.length === 0}
              className="flex-1 rounded-lg bg-ink py-2.5 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-50 transition"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}