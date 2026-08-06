import { useEffect, useState } from 'react';
import { assignmentApi, type AssignmentFormData } from '../api/assignmentApi';
import { courseApi } from '../api/courseApi';
import type { Assignment } from '../types/assignment';
import type { Course } from '../types/course';
import AssignmentFormModal from '../components/AssignmentFormModal';
import { daysUntil } from '../utils/date';

const columns: { status: Assignment['status']; label: string; color: string }[] = [
  { status: 'TODO', label: 'Cần làm', color: 'bg-steel' },
  { status: 'IN_PROGRESS', label: 'Đang làm', color: 'bg-amber' },
  { status: 'COMPLETED', label: 'Hoàn thành', color: 'bg-green-500' },
  { status: 'OVERDUE', label: 'Quá hạn', color: 'bg-red-500' },
];

const priorityLabel: Record<string, string> = { HIGH: 'Cao', MEDIUM: 'TB', LOW: 'Thấp' };
const priorityColor: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber/15 text-ink',
  LOW: 'bg-steel/10 text-steel',
};

const nextStatus: Record<string, Assignment['status'] | null> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED: null,
  OVERDUE: 'COMPLETED',
};

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([assignmentApi.getMyAssignments(), courseApi.getMyCourses()])
      .then(([aRes, cRes]) => {
        setAssignments(aRes.data);
        setCourses(cRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data: AssignmentFormData) => {
    await assignmentApi.create(data);
    load();
  };

  const handleAdvanceStatus = async (a: Assignment) => {
    const next = nextStatus[a.status];
    if (!next) return;
    setUpdatingId(a.id);
    try {
      await assignmentApi.updateStatus(a.id, next);
      setAssignments((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: next } : x)));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá bài tập này?')) return;
    setDeletingId(id);
    try {
      await assignmentApi.delete(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Quản lý</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Bài tập</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition"
        >
          + Thêm bài tập
        </button>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-muted text-sm">Đang tải...</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const items = assignments
              .filter((a) => a.status === col.status)
              .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

            return (
              <div key={col.status} className="rounded-xl bg-white border border-ink/10 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-ink/10">
                  <span className={`h-2 w-2 rounded-full ${col.color}`} />
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{col.label}</p>
                  <span className="ml-auto text-xs text-muted">{items.length}</span>
                </div>

                <div className="p-3 space-y-2 min-h-[120px]">
                  {items.length === 0 ? (
                    <p className="text-xs text-muted/70 text-center py-6">Trống</p>
                  ) : (
                    items.map((a) => {
                      const days = daysUntil(a.deadline);
                      const next = nextStatus[a.status];
                      return (
                        <div key={a.id} className="rounded-lg border border-ink/10 bg-paper p-3 group">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-ink leading-snug">{a.title}</p>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityColor[a.priority]}`}>
                              {priorityLabel[a.priority]}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-1">{a.courseName}</p>
                          <p
                            className={`text-xs mt-1.5 font-medium ${
                              days < 0 ? 'text-red-600' : days <= 2 ? 'text-amber-600' : 'text-steel'
                            }`}
                          >
                            {days < 0
                              ? `Quá hạn ${Math.abs(days)} ngày`
                              : days === 0
                              ? 'Hạn hôm nay'
                              : `Còn ${days} ngày`}
                          </p>

                          <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                            {next && (
                              <button
                                onClick={() => handleAdvanceStatus(a)}
                                disabled={updatingId === a.id}
                                className="text-xs font-medium text-ink hover:underline disabled:opacity-50"
                              >
                                → {columns.find((c) => c.status === next)?.label}
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(a.id)}
                              disabled={deletingId === a.id}
                              className="text-xs text-muted hover:text-red-600 transition ml-auto disabled:opacity-50"
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AssignmentFormModal
        open={modalOpen}
        courses={courses}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}