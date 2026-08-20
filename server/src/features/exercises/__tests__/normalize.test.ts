import { describe, it, expect } from 'vitest';
import { normalizeRow, normalizeRows } from '../scripts/normalizeExercises';
import type { RawExerciseRow } from '../exercise.types';

const importedAt = new Date('2026-01-01T00:00:00.000Z');

function row(overrides: Partial<RawExerciseRow>): RawExerciseRow {
  return {
    '': '0',
    Title: 'Barbell Back Squat',
    Desc: 'A compound lower body exercise.',
    Type: 'Strength',
    BodyPart: 'Quadriceps',
    Equipment: 'Barbell',
    Level: 'Intermediate',
    Rating: '8.5',
    RatingDesc: '',
    ...overrides,
  };
}

describe('normalizeRow', () => {
  it('maps a clean row to a normalized record', () => {
    const result = normalizeRow(row({}), 0, importedAt);
    if ('skipped' in result) throw new Error('expected a record');

    expect(result.record.name).toBe('Barbell Back Squat');
    expect(result.record.slug).toBe('barbell-back-squat');
    expect(result.record.difficulty).toBe('intermediate');
    expect(result.record.movementType).toBe('strength');
    expect(result.record.equipment).toEqual(['barbell']);
    expect(result.record.primaryMuscles).toEqual(['quadriceps']);
    expect(result.record.category).toEqual(['lower_body']);
    expect(result.record.instructions.execution).toBe('A compound lower body exercise.');
    expect(result.record.reviewStatus).toBe('imported');
    expect(result.record.source.provider).toBe('Kaggle');
    expect(result.unmapped).toEqual([]);
  });

  it('skips a row with a blank title', () => {
    const result = normalizeRow(row({ Title: '' }), 4, importedAt);
    expect('skipped' in result).toBe(true);
    if ('skipped' in result) {
      expect(result.skipped.field).toBe('Title');
    }
  });

  it('skips a row with an unmapped Level', () => {
    const result = normalizeRow(row({ Level: 'Unknown' }), 5, importedAt);
    expect('skipped' in result).toBe(true);
    if ('skipped' in result) {
      expect(result.skipped.field).toBe('Level');
    }
  });

  it('skips a row with an unmapped Type', () => {
    const result = normalizeRow(row({ Type: 'Yoga' }), 6, importedAt);
    expect('skipped' in result).toBe(true);
    if ('skipped' in result) {
      expect(result.skipped.field).toBe('Type');
    }
  });

  it('keeps the record but reports an unmapped Equipment value rather than inventing one', () => {
    const result = normalizeRow(row({ Equipment: 'Tractor Beam' }), 6, importedAt);
    if ('skipped' in result) throw new Error('expected a record');

    expect(result.record.equipment).toEqual([]);
    expect(result.unmapped).toHaveLength(1);
    expect(result.unmapped[0].field).toBe('Equipment');
    expect(result.unmapped[0].value).toBe('Tractor Beam');
  });

  it('does not invent instructions.setup or breathing from missing source data', () => {
    const result = normalizeRow(row({}), 0, importedAt);
    if ('skipped' in result) throw new Error('expected a record');

    expect(result.record.instructions.setup).toBe('');
    expect(result.record.instructions.breathing).toBe('');
  });

  it('assigns a muscle to multiple categories when appropriate (back muscle)', () => {
    const result = normalizeRow(row({ BodyPart: 'Lats' }), 0, importedAt);
    if ('skipped' in result) throw new Error('expected a record');

    expect(result.record.category.sort()).toEqual(['back', 'upper_body']);
  });
});

describe('normalizeRows', () => {
  it('separates records, skipped rows, and unmapped values across a batch', () => {
    const rows: RawExerciseRow[] = [
      row({ Title: 'Barbell Back Squat' }),
      row({ Title: '', '': '1' }),
      row({ Title: 'Mystery Move', Level: 'Unknown', '': '2' }),
      row({ Title: 'Alien Curl', Equipment: 'Tractor Beam', '': '3' }),
    ];

    const result = normalizeRows(rows, importedAt);

    expect(result.records).toHaveLength(2);
    expect(result.skippedRows).toHaveLength(2);
    expect(result.unmappedValues).toHaveLength(1);
  });
});
