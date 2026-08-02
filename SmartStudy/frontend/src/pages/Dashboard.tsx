import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboardApi';
import { calendarApi } from '../api/calendarApi';
import { assignmentApi } from '../api/assignmentApi';
import { courseApi } from '../api/courseApi';
import type { DashboardData } from '../types/dashboard';
import type { CalendarEvent } from '../types/calendar';
import type { Assignment } from '../types/assignment';
import type { Course } from '../types/course';
import { useAuth } from '../contexts/AuthContext';
import ProgressRing from '../components/ProgressRing';
import { formatFullDateVN, formatTime, daysUntil } from '../utils/date';

const priorityLabel: Record<string, string> = { HIGH: 'Cao', MEDIUM: 'Trung bình', LOW: 'Thấp' };
const priorityColor: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-amber/15 text-ink',
  LOW: 'bg-steel/10 text-steel',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.getDashboard(),
      calendarApi.getCurrentWeek(),
      assignmentApi.getMyAssignments(),
      courseApi.getMyCourses(),
    ])
      .then(([statsRes, eventsRes, assignmentsRes, coursesRes]) => {
        setStats(statsRes.data);
        setEvents(eventsRes.data);
        setAssignments(assignmentsRes.data);
        setCourses(coursesRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted">Đang tải...</div>;
  }

  const gpaValue = stats?.gpa ?? 0;
  const completionRate = stats && stats.totalAssignments > 0
    ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100)
    : 0;

  const upcomingAssignments = assignments
    .filter((a) => a.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const eventsByDay = events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    const key = new Date(ev.startTime).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
    });
    acc[key] = acc[key] ? [...acc[key], ev] : [ev];
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">Tổng quan</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">
            Chào, {user?.fullName?.split(' ').pop()} 👋
          </h1>
        </div>
        <p className="text-sm text-muted capitalize">{formatFullDateVN(new Date())}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing value={(gpaValue / 10) * 100} color="#F2A65A" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-ink">{gpaValue.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">GPA</p>
            <p className="text-xs text-muted mt-0.5">thang điểm 10</p>
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="relative shrink-0">
            <ProgressRing value={completionRate} color="#16213E" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-ink">{completionRate}%</span>
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Hoàn thành</p>
            <p className="text-xs text-muted mt-0.5">
              {stats?.completedAssignments}/{stats?.totalAssignments} bài tập
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Môn học</p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">{stats?.totalCourses ?? 0}</p>
          <p className="text-xs text-muted mt-1">đang theo học</p>
        </div>

        <div
          className={`rounded-xl border p-5 shadow-sm ${
            (stats?.overdueAssignments ?? 0) > 0 ? 'border-red-200 bg-red-50' : 'border-ink/10 bg-white'
          }`}
        >
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Quá hạn</p>
          <p className={`mt-2 font-display text-3xl font-semibold ${(stats?.overdueAssignments ?? 0) > 0 ? 'text-red-600' : 'text-ink'}`}>
            {stats?.overdueAssignments ?? 0}
          </p>
          <p className="text-xs text-muted mt-1">bài tập cần xử lý</p>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Lịch tuần này</h2>
            <span className="font-mono text-[11px] text-muted">{events.length} sự kiện</span>
          </div>

          {Object.keys(eventsByDay).length === 0 ? (
            <p className="mt-6 text-sm text-muted">Chưa có lịch học hoặc bài tập trong tuần này.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {Object.entries(eventsByDay).map(([day, dayEvents]) => (
                <div key={day}>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">{day}</p>
                  <div className="space-y-2">
                    {dayEvents.map((ev, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border border-ink/5 bg-paper px-3 py-2.5">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${ev.type === 'CLASS' ? 'bg-steel' : 'bg-amber'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink truncate">{ev.title}</p>
                          <p className="text-xs text-muted truncate">{ev.courseName}</p>
                        </div>
                        <span className="font-mono text-xs text-muted shrink-0">{formatTime(ev.startTime)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-ink">Bài tập sắp tới</h2>

          {upcomingAssignments.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Không có bài tập nào đang chờ. Thảnh thơi rồi!</p>
          ) : (
            <div className="mt-4 space-y-3">
              {upcomingAssignments.map((a) => {
                const days = daysUntil(a.deadline);
                return (
                  <div key={a.id} className="rounded-lg border border-ink/5 bg-paper p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{a.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityColor[a.priority]}`}>
                        {priorityLabel[a.priority]}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">{a.courseName}</p>
                    <p className={`text-xs mt-1 font-medium ${days < 0 ? 'text-red-600' : days <= 2 ? 'text-amber-600' : 'text-steel'}`}>
                      {days < 0 ? `Quá hạn ${Math.abs(days)} ngày` : days === 0 ? 'Hạn hôm nay' : `Còn ${days} ngày`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">Môn học của bạn</h2>
        {courses.length === 0 ? (
          <p className="text-sm text-muted">Bạn chưa có môn học nào. Thêm môn học để bắt đầu.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((c) => (
              <div key={c.id} className="rounded-xl border border-ink/10 bg-white overflow-hidden shadow-sm">
                <div className="h-2" style={{ backgroundColor: c.color || '#F2A65A' }} />
                <div className="p-4">
                  <p className="font-display font-semibold text-ink">{c.name}</p>
                  <p className="text-xs text-muted mt-1">{c.code ?? '—'} · {c.credits ?? 0} tín chỉ</p>
                  {c.lecturerName && <p className="text-xs text-muted mt-1">GV: {c.lecturerName}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}