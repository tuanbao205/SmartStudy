import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationApi } from '../api/notificationApi';

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationApi
      .getUnreadCount()
      .then((res) => setUnreadCount(res.data.unreadCount))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ?.split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center gap-4 border-b border-ink/10 bg-white/80 backdrop-blur px-6 py-3 md:px-10">
        <div className="flex-1" />

        <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">⌕</span>
          <input
            type="text"
            placeholder="Tìm môn học, bài tập..."
            className="w-full rounded-lg border border-ink/10 bg-paper py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-ink focus:ring-2 focus:ring-amber/30 transition"
          />
        </div>
      </div>

       <div className="flex-1 flex items-center justify-end gap-4">
        <button className="relative rounded-full p-2 text-ink/70 hover:bg-ink/5 transition" aria-label="Thông báo">
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2 hover:bg-ink/5 transition"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-amber font-display text-sm font-semibold">
            {initials}
          </span>
          <span className="hidden sm:block text-sm font-medium text-ink">{user?.fullName}</span>
          <span className="text-muted text-xs">▾</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-ink/10 bg-white py-1 shadow-lg">
            <div className="px-3 py-2 border-b border-ink/5">
              <p className="text-sm font-medium text-ink truncate">{user?.fullName}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
    </header>
  );
}