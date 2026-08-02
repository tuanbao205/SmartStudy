import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuth } from '../contexts/AuthContext';

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const todayIndex = 3;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      login(response.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-body">
      <div className="w-full max-w-4xl grid md:grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left - Hero panel */}
        <div className="hidden md:flex relative flex-col justify-between overflow-hidden bg-ink px-10 py-10">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-amber/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-ink font-display font-bold text-sm">
              S
            </span>
            <span className="font-display text-xl font-semibold text-white tracking-tight">
              SmartStudy
            </span>
          </div>

          <div className="relative z-10 max-w-xs">
            <h1 className="font-display text-3xl font-semibold leading-tight text-white">
              Mọi deadline,{' '}
              <span className="relative inline-block">
                một chỗ.
                <svg
                  className="absolute left-0 -bottom-1 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 C 60 2, 140 2, 198 9"
                    stroke="#F2A65A"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-200/80">
              Lịch học, bài tập và điểm số của bạn, tổng hợp trong một nơi duy nhất.
            </p>
          </div>

          <div className="relative z-10 mt-6 w-full max-w-xs rotate-[-2deg] rounded-xl bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                Tuần này
              </span>
              <span className="font-mono text-[10px] text-muted">HK1 · 2026</span>
            </div>
            <div className="mt-3 flex justify-between">
              {weekDays.map((day, i) => (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[10px] text-muted">{day}</span>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium ${
                      i === todayIndex ? 'bg-amber text-ink' : 'text-ink/60'
                    }`}
                  >
                    {12 + i}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs text-ink/80">
                  Đồ án Web · còn <span className="font-semibold">2 ngày</span>
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-ink/80">
                  GPA hiện tại · <span className="font-semibold">3.42</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form panel */}
        <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-ink font-display font-bold text-sm">
              S
            </span>
            <span className="font-display text-xl font-semibold text-ink tracking-tight">
              SmartStudy
            </span>
          </div>

          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            Đăng nhập
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            Chào mừng trở lại
          </h2>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@sinhvien.edu.vn"
                required
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-ink focus:ring-2 focus:ring-amber/40"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Mật khẩu
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 outline-none transition focus:border-ink focus:ring-2 focus:ring-amber/40"
              />
              <a href="#" className="text-xs text-steel hover:text-ink transition">
                  Quên mật khẩu?
                </a>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-white transition hover:bg-ink/90 disabled:opacity-50"
            >
              {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-ink hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}