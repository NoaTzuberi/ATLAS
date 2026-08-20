import { useEffect, useState } from 'react';
import { Input } from '../../../../components/common/Input/Input';
import { Button } from '../../../../components/common/Button/Button';
import { ExerciseMedia } from '../../../exercises/components/ExerciseMedia/ExerciseMedia';
import { listExercises } from '../../../../services/exercises/exercisesService';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import type { PublicExercise } from '../../../exercises/types';
import './ExercisePicker.css';

const SEARCH_DEBOUNCE_MS = 350;

interface ExercisePickerProps {
  addedExerciseIds: Set<string>;
  onAdd: (exercise: PublicExercise) => void;
}

export function ExercisePicker({ addedExerciseIds, onAdd }: ExercisePickerProps) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<PublicExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;

    async function search() {
      setIsLoading(true);
      try {
        const data = await listExercises({ search: debouncedSearch, limit: 8 });
        if (!cancelled) {
          setResults(data.items);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    search();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <div className="exercise-picker">
      <div className="exercise-picker-search">
        <svg className="exercise-picker-search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.6" />
          <path d="M13.75 13.75L17.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <Input
          className="exercise-picker-search-input"
          placeholder="Search exercises to add..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          aria-label="Search exercises to add"
        />
      </div>

      {isLoading && <p className="text-caption exercise-picker-status">Searching...</p>}

      {!isLoading && debouncedSearch.trim() && results.length === 0 && (
        <p className="text-caption exercise-picker-status">No exercises match that search.</p>
      )}

      {results.length > 0 && (
        <ul className="exercise-picker-results">
          {results.map((exercise) => {
            const alreadyAdded = addedExerciseIds.has(exercise.id);
            return (
              <li key={exercise.id} className="exercise-picker-result">
                <div className="exercise-picker-result-media">
                  <ExerciseMedia media={exercise.media} alt={exercise.name} variant="card" />
                </div>
                <span className="exercise-picker-result-name">{exercise.name}</span>
                <Button
                  variant="ghost"
                  onClick={() => onAdd(exercise)}
                  disabled={alreadyAdded}
                >
                  {alreadyAdded ? 'Added' : 'Add'}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
