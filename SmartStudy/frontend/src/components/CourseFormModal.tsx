import { useEffect, useState } from 'react';
import type { Course } from '../types/course';
import type { CourseFormData } from '../api/courseApi';

const colorPresets = ['#F2A65A', '#4C6085', '#7C9885', '#C97064', '#8E7CC3', '#5B9BD5'];

interface Props {
  open: boolean;
  initial?: Course | null;
  onClose: () => void;
  onSubmit: (data: CourseFormData) => Promise<void>;
}

export default function CourseFormModal({ open, initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<CourseFormData>({ name: '', color: colorPresets[0] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              name: initial.name,
              code: initial.code ?? '',
              credits: initial.credits ?? undefined,
              lecturerName: initial.lecturerName ?? '',
              semester: initial.semester ?? '',
              academicYear: initial.academicYear ?? '',
              color: initial.color ?? colorPresets[0],
            }
          : { name: '', color: colorPresets[0] }
      );
      setError('');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Tên môn học không được để trống');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            {initial ? 'Sửa môn học' : 'Thêm môn học'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-ink transition text-xl leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Tên môn học *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Lập trình Web"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Mã môn
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="IT101"
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Số tín chỉ
              </label>
              <input
                type="number"
                min={0}
                value={form.credits ?? ''}
                onChange={(e) => setForm({ ...form, credits: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="3"
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Giảng viên
            </label>
            <input
              type="text"
              value={form.lecturerName}
              onChange={(e) => setForm({ ...form, lecturerName: e.target.value })}
              placeholder="Nguyễn Văn B"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Học kỳ
              </label>
              <input
                type="text"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
                placeholder="HK1"
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Năm học
              </label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                placeholder="2026-2027"
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
              Màu hiển thị
            </label>
            <div className="flex gap-2">
              {colorPresets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`h-7 w-7 rounded-full transition ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-ink' : ''
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Chọn màu ${c}`}
                />
              ))}
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
              disabled={saving}
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