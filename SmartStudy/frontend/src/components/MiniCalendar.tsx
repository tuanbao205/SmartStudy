import { useEffect, useState } from 'react';

const weekdayLabels = ['Cn', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface Props {
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function MiniCalendar({ selectedDate, onSelect }: Props) {
  const [viewMonth, setViewMonth] = useState(startOfMonth(selectedDate));

  useEffect(() => {
    setViewMonth(startOfMonth(selectedDate));
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  const today = new Date();
  const startOffset = viewMonth.getDay();
  const gridStart = new Date(viewMonth);
  gridStart.setDate(gridStart.getDate() - startOffset);

  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const changeMonth = (delta: number) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="font-display text-sm font-semibold text-ink">
          Tháng {viewMonth.getMonth() + 1}, {viewMonth.getFullYear()}
        </p>
        <div className="flex gap-1">
          <button onClick={() => changeMonth(-1)} className="rounded p-1 text-muted hover:bg-ink/5 hover:text-ink transition">
            ‹
          </button>
          <button onClick={() => changeMonth(1)} className="rounded p-1 text-muted hover:bg-ink/5 hover:text-ink transition">
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekdayLabels.map((w) => (
          <span key={w} className="font-mono text-[10px] text-muted">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          const inMonth = d.getMonth() === viewMonth.getMonth();
          const isToday = isSameDay(d, today);
          const isSelected = isSameDay(d, selectedDate);
          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition ${
                isSelected
                  ? 'bg-ink text-white font-medium'
                  : isToday
                  ? 'text-amber font-semibold'
                  : inMonth
                  ? 'text-ink/80 hover:bg-ink/5'
                  : 'text-muted/40'
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}