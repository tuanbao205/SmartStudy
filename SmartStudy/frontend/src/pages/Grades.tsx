import { useEffect, useState } from 'react';
import { gradeApi, type GradeComponentFormData } from '../api/gradeApi';
import { courseApi } from '../api/courseApi';
import type { Course } from '../types/course';
import type { CourseGrade, GpaData } from '../types/grade';
import GradeComponentModal from '../components/GradeComponentModal';

export default function Grades() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [courseGrade, setCourseGrade] = useState<CourseGrade | null>(null);
  const [gpaData, setGpaData] = useState<GpaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingGrade, setLoadingGrade] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scoreInputs, setScoreInputs] = useState<Record<string, string>>({});
  const [savingComponent, setSavingComponent] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([courseApi.getMyCourses(), gradeApi.getGpa()])
      .then(([cRes, gRes]) => {
        setCourses(cRes.data);
        setGpaData(gRes.data);
        if (cRes.data.length > 0) setSelectedCourseId(cRes.data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadCourseGrade = (courseId: number) => {
    setLoadingGrade(true);
    gradeApi
      .getCourseGrade(courseId)
      .then((res) => {
        setCourseGrade(res.data);
        const inputs: Record<string, string> = {};
        res.data.details.forEach((d) => {
          inputs[d.componentName] = d.score != null ? String(d.score) : '';
        });
        setScoreInputs(inputs);
      })
      .finally(() => setLoadingGrade(false));
  };

  useEffect(() => {
    if (selectedCourseId) loadCourseGrade(selectedCourseId);
  }, [selectedCourseId]);

  const refreshGpa = () => {
    gradeApi.getGpa().then((res) => setGpaData(res.data));
  };

  const handleAddComponent = async (data: GradeComponentFormData) => {
    await gradeApi.createComponent(data);
    if (selectedCourseId) loadCourseGrade(selectedCourseId);
  };

  const handleSaveScore = async (componentId: number, componentName: string) => {
    const raw = scoreInputs[componentName];
    if (raw === '' || raw == null) return;
    setSavingComponent(componentName);
    try {
      await gradeApi.updateGrade(componentId, Number(raw));
      if (selectedCourseId) await loadCourseGrade(selectedCourseId);
      refreshGpa();
    } finally {
      setSavingComponent(null);
    }
  };

  // Cần map tên component -> id để gọi API cập nhật điểm (API grade-components trả kèm id)
  const [componentIdMap, setComponentIdMap] = useState<Record<string, number>>({});
  useEffect(() => {
    if (selectedCourseId) {
      gradeApi.getComponentsByCourse(selectedCourseId).then((res) => {
        const map: Record<string, number> = {};
        res.data.forEach((c) => (map[c.name] = c.id));
        setComponentIdMap(map);
      });
    }
  }, [selectedCourseId, courseGrade]);

  if (loading) {
    return <div className="p-10 text-center text-muted text-sm">Đang tải...</div>;
  }

  return (
    <div className="p-6 md:p-10">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">Quản lý</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Điểm số</h1>

      {/* GPA tổng */}
      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Tổng điểm tích luỹ</p>
            <div className="mt-1 flex items-baseline gap-3">
            <p className="font-display text-4xl font-semibold text-ink">
                {gpaData?.gpa != null ? gpaData.gpa.toFixed(2) : '—'}
                <span className="text-base text-muted font-body font-normal"> / 10</span>
            </p>
            <p className="font-display text-2xl font-semibold text-amber">
                {gpaData?.gpa4Scale != null ? gpaData.gpa4Scale.toFixed(2) : '—'}
                <span className="text-sm text-muted font-body font-normal"> / 4</span>
            </p>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            {gpaData?.courseSummaries.map((s) => (
              <div key={s.courseId} className="text-right">
                <p className="text-xs text-muted">{s.courseName}</p>
                <p className="text-sm font-semibold text-ink">
                  {s.totalScore != null ? s.totalScore.toFixed(2) : '—'}
                  {s.gpa4Scale != null && (
                    <span className="text-amber ml-1">({s.gpa4Scale.toFixed(1)})</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink/20 bg-white py-16 text-center">
          <p className="text-sm text-muted">Bạn chưa có môn học nào để nhập điểm.</p>
        </div>
      ) : (
        <div className="mt-8 flex gap-6 items-start flex-col lg:flex-row">
          {/* Danh sách môn học */}
          <div className="w-full lg:w-64 shrink-0 space-y-1">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition flex items-center gap-2 ${
                  selectedCourseId === c.id ? 'bg-ink text-white font-medium' : 'text-ink hover:bg-ink/5'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: c.color || '#F2A65A' }}
                />
                {c.name}
              </button>
            ))}
          </div>

          {/* Chi tiết điểm môn đang chọn */}
          <div className="flex-1 min-w-0 rounded-xl border border-ink/10 bg-white shadow-sm">
            {loadingGrade ? (
              <div className="p-10 text-center text-muted text-sm">Đang tải...</div>
            ) : courseGrade ? (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">{courseGrade.courseName}</h2>
                    <p className="text-xs text-muted mt-0.5">
                      Điểm tổng kết:{' '}
                      <span className="font-semibold text-ink">
                        {courseGrade.totalScore != null ? courseGrade.totalScore.toFixed(2) : 'Chưa đủ dữ liệu'}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg border border-ink/15 px-3 py-2 text-xs font-medium text-ink hover:bg-ink/5 transition shrink-0"
                  >
                    + Thành phần điểm
                  </button>
                </div>

                <div className="p-6">
                  {courseGrade.details.length === 0 ? (
                    <p className="text-sm text-muted text-center py-6">
                      Chưa có thành phần điểm nào. Bấm "+ Thành phần điểm" để thêm (VD: Chuyên cần, Giữa kỳ, Cuối kỳ).
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {courseGrade.details.map((d) => {
                        const componentId = componentIdMap[d.componentName];
                        return (
                          <div
                            key={d.componentName}
                            className="flex items-center gap-4 rounded-lg border border-ink/5 bg-paper px-4 py-3"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink">{d.componentName}</p>
                              <p className="text-xs text-muted">Trọng số {d.weight}%</p>
                            </div>
                            <input
                              type="number"
                              min={0}
                              max={10}
                              step={0.1}
                              value={scoreInputs[d.componentName] ?? ''}
                              onChange={(e) =>
                                setScoreInputs({ ...scoreInputs, [d.componentName]: e.target.value })
                              }
                              placeholder="—"
                              className="w-20 rounded-lg border border-ink/15 bg-white px-2.5 py-1.5 text-sm text-center text-ink outline-none focus:border-ink focus:ring-2 focus:ring-amber/40 transition"
                            />
                            <button
                              onClick={() => componentId && handleSaveScore(componentId, d.componentName)}
                              disabled={savingComponent === d.componentName || !componentId}
                              className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-ink/90 disabled:opacity-50 transition shrink-0"
                            >
                              {savingComponent === d.componentName ? '...' : 'Lưu'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {selectedCourseId && (
        <GradeComponentModal
          open={modalOpen}
          courseId={selectedCourseId}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddComponent}
        />
      )}
    </div>
  );
}