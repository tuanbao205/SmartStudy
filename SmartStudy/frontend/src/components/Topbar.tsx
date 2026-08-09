import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationApi } from '../api/notificationApi';
import type { NotificationItem } from '../types/notification';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const loadUnreadCount = () => {
    notificationApi
      .getUnreadCount()
      .then((res) => setUnreadCount(res.data.unreadCount))
      .catch(() => {});
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotif = () => {
    const opening = !notifOpen;
    setNotifOpen(opening);
    if (opening) {
      setNotifLoading(true);
      notificationApi
        .getMy()
        .then((res) => setNotifications(res.data))
        .finally(() => setNotifLoading(false));
    }
  };

  const handleMarkAsRead = async (id: number) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    loadUnreadCount();
  };

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
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleToggleNotif}
            className="relative rounded-full p-2 text-ink/70 hover:bg-ink/5 transition"
            aria-label="Thông báo"
          >
            <span className="text-lg">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-ink/10 bg-white shadow-lg max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-white px-4 py-3 border-b border-ink/10">
                <p className="font-display font-semibold text-ink text-sm">Thông báo</p>
              </div>

              {notifLoading ? (
                <p className="px-4 py-6 text-center text-xs text-muted">Đang tải...</p>
              ) : notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-muted">Chưa có thông báo nào.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                    className={`w-full text-left px-4 py-3 border-b border-ink/5 last:border-0 transition hover:bg-ink/5 ${
                      !n.isRead ? 'bg-amber/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber shrink-0" />}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted/70 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

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