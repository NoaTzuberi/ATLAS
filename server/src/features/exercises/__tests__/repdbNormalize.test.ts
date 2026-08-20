import { describe, it, expect } from 'vitest';
import { normalizeRepDbExercise } from '../scripts/importRepDbPreview';
import type { RawRepDbExercise } from '../exercise.types';

const importedAt = new Date('2026-01-01T00:00:00.000Z');

function rawExercise(overrides: Partial<RawRepDbExercise>): RawRepDbExercise {
  return {
    id: 'pull-up',
    name: 'Pull-Up',
    description: 'A bodyweight compound pull.',
    instructions: ['Hang from a bar.', 'Pull yourself up.'],
    tips: ['Avoid swinging.'],
    category: 'strength',
    force_type: 'pull',
    mechanic: 'compound',
    difficulty: 'intermediate',
    equipment: 'pull_up_bar',
    body_part: 'back',
    primary_muscles: ['latissimus_dorsi'],
    secondary_muscles: ['biceps_brachii', 'posterior_deltoid'],
    goals: ['hypertrophy', 'strength'],
    is_unilateral: false,
    is_bodyweight: false,
    relations: [],
    images: { classic: ['start', 'peak'], flat: ['start', 'peak'] },
    animation: true,
    ...overrides,
  };
}

describe('normalizeRepDbExercise', () => {
  it('maps RepDB category to our movementType, not our category', () => {
    const result = normalizeRepDbExercise(rawExercise({ category: 'cardio' }), importedAt);
    expect(result.movementType).toBe('cardio');
  });

  it('derives category[] from downmapped primary muscles', () => {
    const result = normalizeRepDbExercise(rawExercise({}), importedAt);
    expect(result.primaryMuscles).toEqual(['lats']);
    expect(result.category.sort()).toEqual(['back', 'upper_body']);
  });

  it('downmaps fine-grained RepDB muscles to our coarser vocabulary', () => {
    const result = normalizeRepDbExercise(
      rawExercise({ secondary_muscles: ['biceps_brachii', 'posterior_deltoid', 'rhomboids'] }),
      importedAt,
    );
    expect(result.secondaryMuscles.sort()).toEqual(['biceps', 'middle_back', 'shoulders']);
  });

  it('maps a null equipment + is_bodyweight to our bodyweight value', () => {
    const result = normalizeRepDbExercise(
      rawExercise({ equipment: null, is_bodyweight: true }),
      importedAt,
    );
    expect(result.equipment).toEqual(['bodyweight']);
  });

  it('maps RepDB equipment values we added specifically for this set', () => {
    const result = normalizeRepDbExercise(rawExercise({ equipment: 'pull_up_bar' }), importedAt);
    expect(result.equipment).toEqual(['pull_up_bar']);
  });

  it('renames RepDB equipment onto our existing vocabulary where a clean match exists', () => {
    const result = normalizeRepDbExercise(rawExercise({ equipment: 'smith_machine' }), importedAt);
    expect(result.equipment).toEqual(['machine']);
  });

  it('builds instructions.execution from description + numbered steps, leaves setup/breathing empty', () => {
    const result = normalizeRepDbExercise(rawExercise({}), importedAt);
    expect(result.instructions.execution).toBe(
      'A bodyweight compound pull.\n1. Hang from a bar.\n2. Pull yourself up.',
    );
    expect(result.instructions.setup).toBe('');
    expect(result.instructions.breathing).toBe('');
  });

  it('passes goals/mechanic/forceType/isUnilateral through directly', () => {
    const result = normalizeRepDbExercise(rawExercise({}), importedAt);
    expect(result.goals).toEqual(['hypertrophy', 'strength']);
    expect(result.mechanic).toBe('compound');
    expect(result.forceType).toBe('pull');
    expect(result.isUnilateral).toBe(false);
  });

  it('maps synonyms to aliases', () => {
    const result = normalizeRepDbExercise(rawExercise({ synonyms: ['chin-up variant'] }), importedAt);
    expect(result.aliases).toEqual(['chin-up variant']);
  });

  it('builds media with a flat still, a gif-slot animation, and a multi-style gallery', () => {
    const result = normalizeRepDbExercise(rawExercise({}), importedAt);
    expect(result.media.image).toBe('/media/repdb/flat/pull-up-start.webp');
    expect(result.media.gif).toBe('/media/repdb/animations/pull-up.webp');
    expect(result.media.video).toBeNull();
    expect(result.media.gallery).toHaveLength(6);
    expect(result.media.gallery).toContainEqual({
      style: 'classic_white',
      variant: 'peak',
      url: '/media/repdb/classic-white/pull-up-peak.webp',
    });
  });

  it('stamps RepDB source attribution with the correct license', () => {
    const result = normalizeRepDbExercise(rawExercise({}), importedAt);
    expect(result.source.provider).toBe('RepDB');
    expect(result.source.license).toBe('CC BY-NC 4.0');
    expect(result.source.sourceUrl).toBe('https://repdb.co');
  });

  it('keeps relations as pending, unresolved at normalize time', () => {
    const result = normalizeRepDbExercise(
      rawExercise({ relations: [{ to: 'lat-pulldown', type: 'regression_of' }] }),
      importedAt,
    );
    expect(result.pendingRelations).toEqual([{ to: 'lat-pulldown', type: 'regression_of' }]);
  });
});
