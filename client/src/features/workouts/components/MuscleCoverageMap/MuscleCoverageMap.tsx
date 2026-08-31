import type { ReactNode } from 'react';
import { GlassCard } from '../../../../components/common/GlassCard/GlassCard';
import { computeRegionCoverage, BODY_REGION_LABELS } from '../../data/bodyRegions';
import type { BodyRegion } from '../../data/bodyRegions';
import type { WorkoutExerciseRowValue } from '../WorkoutExerciseRow/WorkoutExerciseRow';
import './MuscleCoverageMap.css';

interface MuscleCoverageMapProps {
  rows: WorkoutExerciseRowValue[];
}

const NEUTRAL_RGB: [number, number, number] = [64, 68, 76];
const ORANGE_RGB: [number, number, number] = [255, 122, 26];
/** Regions hit by 3+ exercises render at full orange — past that, more volume
 * doesn't need to read as visually different. */
const MAX_INTENSITY_COUNT = 3;

function regionFill(count: number): string {
  const t = Math.min(1, count / MAX_INTENSITY_COUNT);
  const mixed = NEUTRAL_RGB.map((from, i) => Math.round(from + (ORANGE_RGB[i] - from) * t));
  return `rgb(${mixed.join(',')})`;
}

function regionGlow(count: number): string {
  if (count === 0) return 'none';
  const t = Math.min(1, count / MAX_INTENSITY_COUNT);
  return `drop-shadow(0 0 ${4 + t * 5}px rgba(255, 122, 26, ${0.25 + t * 0.4}))`;
}

interface RegionShapeProps {
  region: BodyRegion;
  count: number;
  children: (style: { fill: string; filter: string }) => ReactNode;
}

function RegionShape({ region, count, children }: RegionShapeProps) {
  const style = {
    fill: regionFill(count),
    filter: regionGlow(count),
  };
  return <g className="muscle-map-region" style={{ transition: 'fill 0.4s ease, filter 0.4s ease' }} aria-label={`${BODY_REGION_LABELS[region]}: ${count} exercise${count === 1 ? '' : 's'}`}>{children(style)}</g>;
}

const NEUTRAL_FILL = 'rgba(255, 255, 255, 0.08)';
const NEUTRAL_STROKE = 'rgba(255, 255, 255, 0.14)';

export function MuscleCoverageMap({ rows }: MuscleCoverageMapProps) {
  const coverage = computeRegionCoverage(rows);

  return (
    <GlassCard className="muscle-map-card">
      <span className="muscle-map-title">Muscle Coverage</span>

      <svg className="muscle-map-figure" viewBox="0 0 200 380" role="img" aria-label="Muscle coverage diagram">
        {/* Neutral base — head, neck, pelvis, feet caps. Not a tracked region. */}
        <ellipse cx="100" cy="22" rx="15" ry="17" fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} />
        <rect x="93" y="37" width="14" height="8" fill={NEUTRAL_FILL} />
        <rect x="70" y="160" width="60" height="26" rx="13" fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} />
        <ellipse cx="81" cy="356" rx="16" ry="8" fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} />
        <ellipse cx="119" cy="356" rx="16" ry="8" fill={NEUTRAL_FILL} stroke={NEUTRAL_STROKE} />

        <RegionShape region="shoulders" count={coverage.shoulders}>
          {(style) => (
            <>
              <ellipse cx="58" cy="58" rx="17" ry="13" stroke={NEUTRAL_STROKE} style={style} />
              <ellipse cx="142" cy="58" rx="17" ry="13" stroke={NEUTRAL_STROKE} style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="back" count={coverage.back}>
          {(style) => (
            <>
              <rect x="52" y="68" width="14" height="58" rx="7" style={style} />
              <rect x="134" y="68" width="14" height="58" rx="7" style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="biceps" count={coverage.biceps}>
          {(style) => (
            <>
              <rect x="30" y="70" width="22" height="56" rx="11" stroke={NEUTRAL_STROKE} style={style} />
              <rect x="148" y="70" width="22" height="56" rx="11" stroke={NEUTRAL_STROKE} style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="triceps" count={coverage.triceps}>
          {(style) => (
            <>
              <rect x="20" y="74" width="12" height="50" rx="6" style={style} />
              <rect x="168" y="74" width="12" height="50" rx="6" style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="chest" count={coverage.chest}>
          {(style) => <rect x="62" y="62" width="76" height="40" rx="14" stroke={NEUTRAL_STROKE} style={style} />}
        </RegionShape>

        <RegionShape region="forearms" count={coverage.forearms}>
          {(style) => (
            <>
              <rect x="28" y="128" width="20" height="58" rx="10" stroke={NEUTRAL_STROKE} style={style} />
              <rect x="152" y="128" width="20" height="58" rx="10" stroke={NEUTRAL_STROKE} style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="abs" count={coverage.abs}>
          {(style) => <rect x="68" y="104" width="64" height="56" rx="12" stroke={NEUTRAL_STROKE} style={style} />}
        </RegionShape>

        <RegionShape region="glutes" count={coverage.glutes}>
          {(style) => (
            <>
              <rect x="58" y="164" width="14" height="28" rx="7" style={style} />
              <rect x="128" y="164" width="14" height="28" rx="7" style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="quads" count={coverage.quads}>
          {(style) => (
            <>
              <rect x="66" y="188" width="30" height="90" rx="14" stroke={NEUTRAL_STROKE} style={style} />
              <rect x="104" y="188" width="30" height="90" rx="14" stroke={NEUTRAL_STROKE} style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="hamstrings" count={coverage.hamstrings}>
          {(style) => (
            <>
              <rect x="60" y="192" width="10" height="84" rx="5" style={style} />
              <rect x="130" y="192" width="10" height="84" rx="5" style={style} />
            </>
          )}
        </RegionShape>

        <RegionShape region="calves" count={coverage.calves}>
          {(style) => (
            <>
              <rect x="68" y="280" width="26" height="70" rx="13" stroke={NEUTRAL_STROKE} style={style} />
              <rect x="106" y="280" width="26" height="70" rx="13" stroke={NEUTRAL_STROKE} style={style} />
            </>
          )}
        </RegionShape>
      </svg>

      <p className="muscle-map-hint">Highlight brightens as more added exercises target that muscle group.</p>
    </GlassCard>
  );
}
