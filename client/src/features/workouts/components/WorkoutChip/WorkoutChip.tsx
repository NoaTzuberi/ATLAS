import type { ButtonHTMLAttributes } from 'react';
import './WorkoutChip.css';

interface WorkoutChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected: boolean;
}

export function WorkoutChip({ label, selected, className, ...rest }: WorkoutChipProps) {
  const classNames = ['workout-chip', selected ? 'workout-chip-selected' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classNames} aria-pressed={selected} {...rest}>
      <span className="workout-chip-label">{label}</span>
    </button>
  );
}
