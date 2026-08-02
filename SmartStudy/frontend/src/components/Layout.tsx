import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: '◱' },
  { to: '/courses', label: 'Môn học', icon: '▤' },
  { to: '/schedule', label: 'Lịch học', icon: '▦' },
  { to: '/assignments', label: 'Bài tập', icon: '☰' },
  { to: '/grades', label: 'Điểm số', icon: '✓' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-paper font-body flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-ink px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber text-ink font-display font-bold text-sm">
            S
          </span>
          <span className="font-display text-lg font-semibold text-white tracking-tight">
            SmartStudy
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-amber text-ink font-medium'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <div className="px-2 mb-2">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}