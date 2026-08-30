import { IconBarbell, IconArrowBigDownLines, IconShirtSport, IconStairs, IconYoga, IconTargetArrow } from '@tabler/icons-react';

// Real icons from @tabler/icons-react, verified against the installed package's
// SVG source before picking — see conversation for the confirmed name-per-category
// mapping. Wrapped so the rest of the feature keeps a stable naming convention
// (PushIcon, PullIcon, ...) independent of which underlying icon backs each one.

export function PushIcon() {
  return <IconBarbell stroke={1.5} />;
}

export function PullIcon() {
  return <IconArrowBigDownLines stroke={1.5} />;
}

export function UpperBodyIcon() {
  return <IconShirtSport stroke={1.5} />;
}

export function LowerBodyIcon() {
  return <IconStairs stroke={1.5} />;
}

export function FullBodyIcon() {
  return <IconYoga stroke={1.5} />;
}

export function CoreIcon() {
  return <IconTargetArrow stroke={1.5} />;
}
