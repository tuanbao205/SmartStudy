import { useEffect, useState } from 'react';
import type { Course } from '../types/course';
import type { AssignmentFormData } from '../api/assignmentApi';

interface Props {
  open: boolean;
  courses: Course[];
  onClose: () => void;
  onSubmit: (data: AssignmentFormData) => Promise<void>;
}

export default function AssignmentFormModal({ open, courses, onClose, onSubmit }: Props) {
  const [courseId, setCourseId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCourseId(courses[0]?.id ?? '');
      setTitle('');
      setDescription('');
      setDeadline('');
      setPriority('MEDIUM');
      setEstimatedHours('');
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
    if (!title.trim()) {
      setError('Vui lòng nhập tên bài tập');
      return;
    }
    if (!deadline) {
      setError('Vui lòng chọn deadline');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        courseId: Number(courseId),
        title,
        description: description || undefined,
        deadline: new Date(deadline).toISOString(),
        priority,
        estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
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
          <h2 className="font-display text-lg font-semibold text-ink">Thêm bài tập</h2>
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
              Tên bài tập *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Làm báo cáo Spring Boot"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Chi tiết bài tập..."
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Deadline *
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Thời gian ước tính (giờ)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="5"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            />
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