import { useState } from 'react';
import type { GradeComponentFormData } from '../api/gradeApi';

interface Props {
  open: boolean;
  courseId: number;
  onClose: () => void;
  onSubmit: (data: GradeComponentFormData) => Promise<void>;
}

export default function GradeComponentModal({ open, courseId, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !weight) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ courseId, name, weight: Number(weight) });
      setName('');
      setWeight('');
      onClose();
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">Thêm thành phần điểm</h2>
          <button onClick={onClose} className="text-muted hover:text-ink transition text-xl leading-none">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Tên thành phần *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Giữa kỳ"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
              Trọng số (%) *
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="30"
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