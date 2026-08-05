import { useEffect, useState } from 'react';
import { scheduleApi, type ScheduleFormData } from '../api/scheduleApi';
import { courseApi } from '../api/courseApi';
import { assignmentApi } from '../api/assignmentApi';
import type { Schedule } from '../types/schedule';
import type { Course } from '../types/course';
import type { Assignment } from '../types/assignment';
import ScheduleFormModal from '../components/ScheduleFormModal';
import MiniCalendar from '../components/MiniCalendar';
import { startOfWeekMonday, addDays, isSameDay, dateToDayOfWeek, formatWeekRangeVN } from '../utils/date';

const START_HOUR = 6;
const END_HOUR = 21;
const HOUR_HEIGHT = 56;

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Kiểm tra 1 schedule có áp dụng cho ngày cụ thể không (dựa vào startDate/endDate nếu có)
function isScheduleActiveOnDate(s: Schedule, date: Date): boolean {
  const dateStr = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
  if (s.startDate && dateStr < s.startDate) return false;
  if (s.endDate && dateStr > s.endDate) return false;
  return true;
}

type Selected = { kind: 'schedule'; data: Schedule } | { kind: 'assignment'; data: Assignment };

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [anchorDate, setAnchorDate] = useState(new Date());

  const load = () => {
    setLoading(true);
    Promise.all([scheduleApi.getMySchedules(), courseApi.getMyCourses(), assignmentApi.getMyAssignments()])
      .then(([sRes, cRes, aRes]) => {
        setSchedules(sRes.data);
        setCourses(cRes.data);
        setAssignments(aRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data: ScheduleFormData) => {
    await scheduleApi.create(data);
    load();
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Xoá lịch học này?')) return;
    setDeletingId(id);
    try {
      await scheduleApi.delete(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      setSelected(null);
    } finally {
      setDeletingId(null);
    }
  };

  const weekStart = startOfWeekMonday(anchorDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = weekDates[6];
  const today = new Date();

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const gridHeight = hours.length * HOUR_HEIGHT;

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Quản lý</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Lịch học</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition"
        >
          + Thêm lịch học
        </button>
      </div>

      <div className="mt-8 flex gap-6 items-start">
        {/* Main grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnchorDate(new Date())}
                className="rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5 transition"
              >
                Hôm nay
              </button>
              <button
                onClick={() => setAnchorDate(addDays(anchorDate, -7))}
                className="rounded-lg p-1.5 text-ink/70 hover:bg-ink/5 transition"
                aria-label="Tuần trước"
              >
                ‹
              </button>
              <button
                onClick={() => setAnchorDate(addDays(anchorDate, 7))}
                className="rounded-lg p-1.5 text-ink/70 hover:bg-ink/5 transition"
                aria-label="Tuần sau"
              >
                ›
              </button>
              <span className="font-display text-lg font-semibold text-ink ml-1">
                {formatWeekRangeVN(weekStart, weekEnd)}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-muted text-sm py-10">Đang tải...</div>
          ) : (
            <div className="rounded-xl border border-ink/10 bg-white shadow-sm overflow-hidden">
              <div className="grid" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
                <div className="border-b border-ink/10" />
                {weekDates.map((d) => {
                  const isToday = isSameDay(d, today);
                  return (
                    <div
                      key={d.toISOString()}
                      className={`border-b border-l border-ink/10 py-2 text-center ${isToday ? 'bg-amber/10' : ''}`}
                    >
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()]}
                      </p>
                      <p
                        className={`mt-0.5 font-display text-lg font-semibold ${
                          isToday ? 'text-ink' : 'text-ink/70'
                        }`}
                      >
                        {isToday ? (
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white text-sm">
                            {d.getDate()}
                          </span>
                        ) : (
                          d.getDate()
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="relative grid overflow-x-auto" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
                <div className="relative">
                  {hours.map((h) => (
                    <div key={h} className="border-b border-ink/5 pr-2 text-right" style={{ height: HOUR_HEIGHT }}>
                      <span className="relative -top-2 font-mono text-[10px] text-muted">{h}:00</span>
                    </div>
                  ))}
                </div>

                {weekDates.map((d) => {
                  const dow = dateToDayOfWeek(d);
                  const isToday = isSameDay(d, today);
                  const dayAssignments = assignments.filter((a) => isSameDay(new Date(a.deadline), d));

                  return (
                    <div
                      key={d.toISOString()}
                      className={`relative border-l border-ink/10 ${isToday ? 'bg-amber/5' : ''}`}
                      style={{ height: gridHeight }}
                    >
                      {hours.map((h) => (
                        <div key={h} className="border-b border-ink/5" style={{ height: HOUR_HEIGHT }} />
                      ))}

                      {schedules
                        .filter((s) => s.dayOfWeek === dow && isScheduleActiveOnDate(s, d))
                        .map((s) => {
                          const startMin = timeToMinutes(s.startTime.slice(0, 5));
                          const endMin = timeToMinutes(s.endTime.slice(0, 5));
                          const top = ((startMin - START_HOUR * 60) / 60) * HOUR_HEIGHT;
                          const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;
                          const course = courses.find((c) => c.id === s.courseId);

                          return (
                            <button
                              key={s.id}
                              onClick={() => setSelected({ kind: 'schedule', data: s })}
                              className="absolute left-1 right-1 rounded-md px-2 py-1 text-left overflow-hidden shadow-sm transition hover:brightness-95"
                              style={{
                                top,
                                height: Math.max(height, 24),
                                backgroundColor: (course?.color || '#F2A65A') + '22',
                                borderLeft: `3px solid ${course?.color || '#F2A65A'}`,
                              }}
                            >
                              <p className="text-[11px] font-medium text-ink truncate leading-tight">{s.courseName}</p>
                              {height > 32 && (
                                <p className="text-[10px] text-muted truncate leading-tight">
                                  {s.startTime.slice(0, 5)}–{s.endTime.slice(0, 5)} {s.room && `· ${s.room}`}
                                </p>
                              )}
                            </button>
                          );
                        })}

                      {dayAssignments.map((a) => {
                        const deadlineDate = new Date(a.deadline);
                        const minutes = deadlineDate.getHours() * 60 + deadlineDate.getMinutes();
                        const top = ((minutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;

                        return (
                          <button
                            key={`a-${a.id}`}
                            onClick={() => setSelected({ kind: 'assignment', data: a })}
                            className="absolute left-1 right-1 rounded-md border-l-[3px] border-red-500 bg-red-50 px-2 py-1 text-left shadow-sm transition hover:brightness-95"
                            style={{ top, height: 22 }}
                          >
                            <p className="text-[10px] font-medium text-red-700 truncate leading-tight">
                              ⏰ {a.title}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: mini calendar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-4">
          <MiniCalendar selectedDate={anchorDate} onSelect={setAnchorDate} />
        </div>
      </div>

      {/* Popup chi tiết */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            {selected.kind === 'schedule' ? (
              <>
                <h3 className="font-display text-lg font-semibold text-ink">{selected.data.courseName}</h3>
                <p className="text-sm text-muted mt-1">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][selected.data.dayOfWeek % 7]} ·{' '}
                  {selected.data.startTime.slice(0, 5)}–{selected.data.endTime.slice(0, 5)}
                </p>
                {selected.data.room && <p className="text-sm text-muted">Phòng {selected.data.room}</p>}
                {(selected.data.startDate || selected.data.endDate) && (
                  <p className="text-xs text-muted mt-1">
                    Áp dụng: {selected.data.startDate || '…'} → {selected.data.endDate || '…'}
                  </p>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 rounded-lg border border-ink/15 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 transition"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(selected.data.id)}
                    disabled={deletingId === selected.data.id}
                    className="flex-1 rounded-lg bg-red-50 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
                  >
                    Xoá lịch
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-semibold text-ink">{selected.data.title}</h3>
                <p className="text-sm text-muted mt-1">{selected.data.courseName}</p>
                <p className="text-sm text-red-600 font-medium mt-1">
                  Deadline: {new Date(selected.data.deadline).toLocaleString('vi-VN')}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-6 w-full rounded-lg border border-ink/15 py-2.5 text-sm font-medium text-ink hover:bg-ink/5 transition"
                >
                  Đóng
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ScheduleFormModal
        open={modalOpen}
        courses={courses}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}