/**
 * Imports the RepDB preview pack (server/data/repdb-preview/, CC BY-NC 4.0,
 * non-commercial use only — see docs/THIRD_PARTY_CONTENT.md) as the
 * "enhanced" content tier: 16 curated exercises with richer structured data
 * and real media, layered on top of (never replacing) the 2,893 Kaggle-
 * derived exercises. Idempotent, never runs at server startup — run
 * manually via `npm run import:repdb`.
 */
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import { connectDatabase } from '../../../config/database';
import { Exercise } from '../exercise.model';
import {
  REPDB_CATEGORY_TO_MOVEMENT_TYPE,
  REPDB_EQUIPMENT_TO_EQUIPMENT,
  REPDB_MUSCLE_TO_MUSCLE,
  REPDB_RELATION_TYPE_TO_FIELD,
  MUSCLE_TO_CATEGORIES,
} from '../exercise.constants';
import type { Category, Muscle, Equipment, ExerciseGoal, Mechanic, ForceType } from '../exercise.constants';
import type { RawRepDbExercise, NormalizedRepDbExercise, ExerciseMediaAsset } from '../exercise.types';

const DEFAULT_PACK_PATH = join(__dirname, '../../../../data/repdb-preview');
const REPORT_DIR = join(__dirname, '../../../../data/processed');
const MEDIA_BASE_URL = '/media/repdb';

const ATTRIBUTION = {
  provider: 'RepDB',
  dataset: 'repdb-preview',
  license: 'CC BY-NC 4.0',
  sourceUrl: 'https://repdb.co',
};

function mapMuscles(values: string[] | undefined): Muscle[] {
  if (!values) return [];
  const mapped = values.map((value) => REPDB_MUSCLE_TO_MUSCLE[value]).filter(Boolean);
  return Array.from(new Set(mapped));
}

function deriveCategories(primaryMuscles: Muscle[]): Category[] {
  const categories = primaryMuscles.flatMap((muscle) => MUSCLE_TO_CATEGORIES[muscle] ?? []);
  return Array.from(new Set(categories));
}

function mapEquipment(raw: RawRepDbExercise): Equipment[] {
  if (raw.is_bodyweight || !raw.equipment) {
    return ['bodyweight'];
  }
  const mapped = REPDB_EQUIPMENT_TO_EQUIPMENT[raw.equipment];
  return mapped ? [mapped] : ['other'];
}

function buildInstructions(raw: RawRepDbExercise): string {
  const parts: string[] = [];
  if (raw.description) parts.push(raw.description);
  if (raw.instructions?.length) {
    raw.instructions.forEach((step, index) => parts.push(`${index + 1}. ${step}`));
  }
  return parts.join('\n');
}

function buildMedia(raw: RawRepDbExercise) {
  const gallery: ExerciseMediaAsset[] = [];

  // `flat` variant labels apply to the flat/ folder. `classic` variant
  // labels apply to BOTH classic/ (transparent, Standard tier) and
  // classic-white/ (white bg, Starter tier) — same poses, two renders.
  const styleFolders: { style: ExerciseMediaAsset['style']; folder: string; variants: string[] | undefined }[] = [
    { style: 'flat', folder: 'flat', variants: raw.images?.flat },
    { style: 'classic', folder: 'classic', variants: raw.images?.classic },
    { style: 'classic_white', folder: 'classic-white', variants: raw.images?.classic },
  ];

  for (const { style, folder, variants } of styleFolders) {
    if (!variants) continue;
    for (const variant of variants) {
      gallery.push({
        style,
        variant: variant as ExerciseMediaAsset['variant'],
        url: `${MEDIA_BASE_URL}/${folder}/${raw.id}-${variant}.webp`,
      });
    }
  }

  const primaryStill = gallery.find((asset) => asset.style === 'flat') ?? gallery[0];
  const animationUrl = raw.animation ? `${MEDIA_BASE_URL}/animations/${raw.id}.webp` : null;

  return {
    image: primaryStill?.url ?? null,
    // WebP animations act like GIFs in the UI — reusing the existing `gif`
    // field means the current ExerciseMedia component prefers them with
    // zero frontend changes needed.
    gif: animationUrl,
    video: null,
    gallery,
    animationUrl,
  };
}

export function normalizeRepDbExercise(
  raw: RawRepDbExercise,
  importedAt: Date,
): NormalizedRepDbExercise {
  const primaryMuscles = mapMuscles(raw.primary_muscles);
  const secondaryMuscles = mapMuscles(raw.secondary_muscles);

  return {
    slug: raw.id,
    name: raw.name,
    aliases: raw.synonyms ?? [],
    category: deriveCategories(primaryMuscles),
    primaryMuscles,
    secondaryMuscles,
    equipment: mapEquipment(raw),
    difficulty: (raw.difficulty as NormalizedRepDbExercise['difficulty']) ?? 'intermediate',
    movementType: REPDB_CATEGORY_TO_MOVEMENT_TYPE[raw.category ?? ''] ?? 'strength',
    instructions: { setup: '', execution: buildInstructions(raw), breathing: '' },
    tips: raw.tips ?? [],
    goals: (raw.goals ?? []) as ExerciseGoal[],
    mechanic: raw.mechanic as Mechanic | undefined,
    forceType: raw.force_type as ForceType | undefined,
    isUnilateral: raw.is_unilateral ?? false,
    media: buildMedia(raw),
    source: {
      provider: ATTRIBUTION.provider,
      dataset: ATTRIBUTION.dataset,
      originalTitle: raw.name,
      importedAt,
      license: ATTRIBUTION.license,
      sourceUrl: ATTRIBUTION.sourceUrl,
      raw: raw as unknown as Record<string, unknown>,
    },
    pendingRelations: raw.relations ?? [],
  };
}

interface ImportReport {
  runAt: string;
  totalProcessed: number;
  inserted: number;
  upgradedExisting: number;
  skippedCuratedConflicts: number;
  relationsResolved: number;
  relationsUnresolved: { from: string; to: string; type: string }[];
}

export async function runRepDbImport(packPath: string = DEFAULT_PACK_PATH): Promise<ImportReport> {
  const content = readFileSync(join(packPath, 'preview.en.json'), 'utf-8');
  const parsed = JSON.parse(content) as { exercises: RawRepDbExercise[] };
  const importedAt = new Date();

  const normalized = parsed.exercises.map((raw) => normalizeRepDbExercise(raw, importedAt));

  let inserted = 0;
  let upgraded = 0;
  let curatedSkips = 0;
  const slugToId = new Map<string, mongoose.Types.ObjectId>();

  for (const record of normalized) {
    const existing = await Exercise.findOne({ slug: record.slug });

    if (existing && (existing.reviewStatus === 'published' || existing.reviewStatus === 'reviewed') && existing.contentTier !== 'enhanced') {
      curatedSkips += 1;
      slugToId.set(record.slug, existing._id as mongoose.Types.ObjectId);
      continue;
    }

    if (existing) {
      existing.set({
        name: record.name,
        aliases: record.aliases,
        category: record.category,
        primaryMuscles: record.primaryMuscles,
        secondaryMuscles: record.secondaryMuscles,
        equipment: record.equipment,
        difficulty: record.difficulty,
        movementType: record.movementType,
        instructions: record.instructions,
        tips: record.tips,
        goals: record.goals,
        mechanic: record.mechanic,
        forceType: record.forceType,
        isUnilateral: record.isUnilateral,
        media: record.media,
        source: record.source,
        reviewStatus: 'published',
        contentTier: 'enhanced',
      });
      await existing.save();
      upgraded += 1;
      slugToId.set(record.slug, existing._id as mongoose.Types.ObjectId);
    } else {
      const created = await Exercise.create({
        slug: record.slug,
        name: record.name,
        aliases: record.aliases,
        category: record.category,
        primaryMuscles: record.primaryMuscles,
        secondaryMuscles: record.secondaryMuscles,
        equipment: record.equipment,
        difficulty: record.difficulty,
        movementType: record.movementType,
        instructions: record.instructions,
        tips: record.tips,
        goals: record.goals,
        mechanic: record.mechanic,
        forceType: record.forceType,
        isUnilateral: record.isUnilateral,
        media: record.media,
        source: record.source,
        reviewStatus: 'published',
        contentTier: 'enhanced',
      });
      inserted += 1;
      slugToId.set(record.slug, created._id as mongoose.Types.ObjectId);
    }
  }

  // Second pass: resolve relations[] to ObjectIds, but only for targets that
  // are themselves part of this 16-exercise set — most of RepDB's full
  // 520-exercise catalog isn't in our database, so those targets can't
  // resolve to anything yet (kept in source.raw for future re-linking).
  let relationsResolved = 0;
  const relationsUnresolved: ImportReport['relationsUnresolved'] = [];

  for (const record of normalized) {
    const fieldUpdates: Record<'progressions' | 'regressions' | 'alternatives', mongoose.Types.ObjectId[]> = {
      progressions: [],
      regressions: [],
      alternatives: [],
    };

    for (const relation of record.pendingRelations) {
      const targetId = slugToId.get(relation.to);
      const field = REPDB_RELATION_TYPE_TO_FIELD[relation.type];
      if (targetId && field) {
        fieldUpdates[field].push(targetId);
        relationsResolved += 1;
      } else {
        relationsUnresolved.push({ from: record.slug, to: relation.to, type: relation.type });
      }
    }

    if (Object.values(fieldUpdates).some((arr) => arr.length > 0)) {
      await Exercise.updateOne({ slug: record.slug }, { $set: fieldUpdates });
    }
  }

  const report: ImportReport = {
    runAt: importedAt.toISOString(),
    totalProcessed: normalized.length,
    inserted,
    upgradedExisting: upgraded,
    skippedCuratedConflicts: curatedSkips,
    relationsResolved,
    relationsUnresolved,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    join(REPORT_DIR, `repdb-import-report-${Date.now()}.json`),
    JSON.stringify(report, null, 2),
    'utf-8',
  );

  return report;
}

async function main() {
  await connectDatabase();
  try {
    const report = await runRepDbImport();
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('RepDB import failed:', error);
    process.exitCode = 1;
  });
}
