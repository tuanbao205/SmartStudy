import { useEffect, useState } from 'react';
import { courseApi, type CourseFormData } from '../api/courseApi';
import type { Course } from '../types/course';
import CourseFormModal from '../components/CourseFormModal';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCourses = () => {
    setLoading(true);
    courseApi
      .getMyCourses()
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreate = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSubmit = async (data: CourseFormData) => {
    if (editingCourse) {
      await courseApi.update(editingCourse.id, data);
    } else {
      await courseApi.create(data);
    }
    loadCourses();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xoá môn học này? Toàn bộ lịch học, bài tập, điểm liên quan cũng sẽ bị xoá.')) return;
    setDeletingId(id);
    try {
      await courseApi.delete(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Quản lý</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Môn học</h1>
        </div>
        <button
          onClick={handleCreate}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition"
        >
          + Thêm môn học
        </button>
      </div>

      {loading ? (
        <div className="mt-10 text-center text-muted text-sm">Đang tải...</div>
      ) : courses.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-ink/20 bg-white py-16 text-center">
          <p className="text-sm text-muted">Bạn chưa có môn học nào.</p>
          <button
            onClick={handleCreate}
            className="mt-3 text-sm font-medium text-ink hover:underline"
          >
            Thêm môn học đầu tiên
          </button>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="group rounded-xl border border-ink/10 bg-white overflow-hidden shadow-sm">
              <div className="h-2" style={{ backgroundColor: c.color || '#F2A65A' }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-ink truncate">{c.name}</p>
                    <p className="text-xs text-muted mt-1">
                      {c.code || '—'} · {c.credits ?? 0} tín chỉ
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => handleEdit(c)}
                      className="rounded-md p-1.5 text-muted hover:bg-ink/5 hover:text-ink transition"
                      aria-label="Sửa"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                      aria-label="Xoá"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1 border-t border-ink/5 pt-3">
                  {c.lecturerName && (
                    <p className="text-xs text-muted">GV: {c.lecturerName}</p>
                  )}
                  {(c.semester || c.academicYear) && (
                    <p className="text-xs text-muted">
                      {c.semester} {c.academicYear && `· ${c.academicYear}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseFormModal
        open={modalOpen}
        initial={editingCourse}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}