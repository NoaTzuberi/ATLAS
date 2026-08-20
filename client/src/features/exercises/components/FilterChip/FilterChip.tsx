import type { ButtonHTMLAttributes } from 'react';
import './FilterChip.css';

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected: boolean;
}

export function FilterChip({ label, selected, className, ...rest }: FilterChipProps) {
  const classNames = ['filter-chip', selected ? 'filter-chip-selected' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classNames} aria-pressed={selected} {...rest}>
      <span className="filter-chip-label">{label}</span>
    </button>
  );
}
