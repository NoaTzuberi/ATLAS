import './MonthCalendar.css';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface MonthCalendarProps {
  year: number;
  month: number;
  workoutDates: Set<string>;
  activityDates: Set<string>;
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthCalendar({
  year,
  month,
  workoutDates,
  activityDates,
  selectedDateKey,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay();
  const todayKey = toDateKey(new Date());

  const cells: Array<{ day: number; dateKey: string } | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return { day: i + 1, dateKey: toDateKey(date) };
    }),
  ];

  return (
    <div className="month-calendar">
      <div className="month-calendar-header">
        <button type="button" onClick={onPrevMonth} aria-label="Previous month">
          &larr;
        </button>
        <h2>
          {MONTH_LABELS[month]} {year}
        </h2>
        <button type="button" onClick={onNextMonth} aria-label="Next month">
          &rarr;
        </button>
      </div>

      <div className="month-calendar-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="month-calendar-grid">
        {cells.map((cell, index) => {
          if (!cell) {
            return <div key={`blank-${index}`} className="month-calendar-cell month-calendar-cell-blank" />;
          }

          const hasWorkout = workoutDates.has(cell.dateKey);
          const hasActivity = activityDates.has(cell.dateKey);
          const isToday = cell.dateKey === todayKey;
          const isSelected = cell.dateKey === selectedDateKey;

          const classNames = [
            'month-calendar-cell',
            isToday ? 'month-calendar-cell-today' : '',
            isSelected ? 'month-calendar-cell-selected' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={cell.dateKey}
              type="button"
              className={classNames}
              onClick={() => onSelectDate(cell.dateKey)}
            >
              <span className="month-calendar-day">{cell.day}</span>
              {(hasWorkout || hasActivity) && (
                <span className="month-calendar-dots">
                  {hasWorkout && <span className="month-calendar-dot month-calendar-dot-workout" />}
                  {hasActivity && <span className="month-calendar-dot month-calendar-dot-activity" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
