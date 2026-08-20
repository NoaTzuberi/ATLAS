ATLAS — Third-Party Content Notice

⸻

RepDB Preview Pack

Source: https://repdb.co
License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
License text: server/data/repdb-preview/LICENSE.md

⸻

Required attribution

"Exercise data & images: RepDB (https://repdb.co)"

This attribution is shown in-app on every exercise page sourced from RepDB
(see the "contentTier: enhanced" badge and credit line), and is repeated here
per the license's attribution requirement.

⸻

What this covers

16 exercises' structured data (instructions, tips, category, force type,
mechanic, difficulty, equipment, muscles, goals, unilateral flag, relations)
and their images (flat/classic/classic-white stills, WebP animations, muscle
diagrams, equipment icons), stored under server/data/repdb-preview/ and
served at /media/repdb/*.

These 16 exercises are marked contentTier: "enhanced" in the exercises
collection (server/src/features/exercises/exercise.model.ts) and are layered
on top of — never replacing — the other ~2,889 exercises imported from the
Kaggle "Gym Exercise Data" dataset (niharika41298/gym-exercise-data, its own
separate source, kept isolated from RepDB content).

⸻

Non-commercial use only

This project (ATLAS) is currently an academic / final-year project and is
not used commercially. The CC BY-NC 4.0 license permits this use ("personal,
research, and non-commercial projects"). It does NOT permit revenue-
generating use — a paid app, paid feature, advertising-supported product, or
client work — without upgrading to a RepDB paid tier (see
https://repdb.co/pricing).

If ATLAS is ever taken toward commercial use, this content must be either:
- removed, or
- properly licensed via a RepDB paid tier first.

Do not describe this content as proprietary ATLAS content — it remains
RepDB's, under RepDB's license, for as long as it's used here.

⸻

Where this lives in the codebase

- Raw source (gitignored, not committed): server/data/repdb-preview/
- Import script: server/src/features/exercises/scripts/importRepDbPreview.ts
- Served media: server/src/app.ts (`/media/repdb` static route)
- Mapping tables: server/src/features/exercises/exercise.constants.ts
  (REPDB_* prefixed exports)

⸻

Kaggle "Gym Exercise Data"

Source: https://www.kaggle.com/datasets/niharika41298/gym-exercise-data
License: as published by the dataset's author on Kaggle (no explicit
attribution string required by that dataset at the time of import).
Used as the bulk/raw exercise catalog (~2,889 of the ~2,905 total exercises),
imported via server/src/features/exercises/scripts/importExercises.ts. Kept
in its own raw directory (server/data/raw/gym-exercise-data/, gitignored),
isolated from the RepDB pack.

⸻

End of Third-Party Content Notice
