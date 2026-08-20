ATLAS — Database Schema Document

Version 1.0

⸻

1. Database Overview

Database:

MongoDB

⸻

Why MongoDB?

ATLAS contains highly flexible and evolving data:

* User preferences
* Workout structures
* Exercise variations
* Multi-sport activities
* AI memory
* Knowledge documents

MongoDB allows flexible documents while maintaining structured collections.

⸻

2. Database Design Principles

Principle 1 — Store User Context

The system needs enough information to personalize experiences.

Examples:

* Goals
* Preferences
* Training style
* Equipment
* History

⸻

Principle 2 — Separate Templates From Reality

A planned workout and a completed workout are different entities.

Example:

Template:

“Push Strength Program”

Session:

“Noa completed Push Strength on August 2”

⸻

Principle 3 — Keep Historical Data

Progress depends on history.

Never overwrite important performance data.

Examples:

Keep:

* Previous weights
* Personal records
* Completed workouts

⸻

Principle 4 — Prepare For AI

Database must support:

* Agent context
* Memory
* Recommendations
* RAG retrieval

⸻

3. Collections Overview

users
exercises
workoutTemplates
workouts
activities
progress
personalRecords
conversations
aiMemory
knowledgeChunks
achievements

⸻

4. Users Collection

Purpose

Stores authentication and user profile information.

⸻

Collection:

users

⸻

Schema:

{
_id: ObjectId,
name: String,
email: String,
passwordHash: String,
profile: {
age: Number,
height: Number,
weight: Number,
gender:
"male | female | other",
goals: [String],
trainingFrequency: {
minDays: Number,
maxDays: Number,
flexibleSchedule: Boolean
},
preferredActivities: [String],
exercisePreferences: {
favoriteExerciseNotes: String,
improvementExerciseNotes: String,
muscleFocus: [String]
},
equipment: [String],
recovery: {
flags: [String],
notes: String
}
},
preferences:{
units:{
weight:
"kg | lb",
distance:
"km | miles"
},
notifications:Boolean
},
onboardingCompleted:Boolean,
createdAt:Date,
updatedAt:Date
}

⸻

Note on option IDs

Stable IDs for goals, preferredActivities, equipment, exercisePreferences.muscleFocus, recovery.flags, and gender are defined in server/src/features/users/users.constants.ts (mirrored for UI labels in client/src/features/onboarding/data/). This document intentionally does not duplicate that list — check the constants file for the current authoritative set.

Superseded fields

experienceLevel, injuries, and favoriteExercises (ObjectId refs) described in earlier drafts of this document were not implemented during Phase 3. Recovery and exercise history are currently captured as free-text notes plus a fixed set of recovery flags instead — see docs/Onboarding.txt for the onboarding flow these fields come from. favoriteExercises as ObjectId references to a real Exercise collection remains a candidate for Phase 4, once the Exercise Library exists to reference.

⸻

5. Exercises Collection

Purpose

The complete exercise intelligence database.

This collection is also a major RAG source.

⸻

Collection:

exercises

⸻

Schema:

{
_id:ObjectId,
slug:String,
name:String,
aliases:[String],
category:[
"upper_body",
"back",
"core",
"lower_body"
],
primaryMuscles:[String],
secondaryMuscles:[String],
equipment:[String],
difficulty:
"beginner | intermediate | advanced",
movementType:
"strength | mobility | cardio",
instructions:{
setup:String,
execution:String,
breathing:String
},
commonMistakes:[String],
tips:[String],
progressions:[ObjectId],
regressions:[ObjectId],
variations:[ObjectId],
alternatives:[ObjectId],
media:{
image:String,
gif:String,
video:String,
gallery:[
{ style: "flat | classic | classic_white", variant: "start | peak | main", url: String }
],
animationUrl:String
},
source:{
provider:String,
dataset:String,
originalTitle:String,
importedAt:Date,
license:String,
sourceUrl:String,
raw:Mixed
},
reviewStatus:
"imported | reviewed | published | rejected",
isActive:Boolean,
contentTier:
"standard | enhanced",
goals:[String],
mechanic:
"compound | isolation",
forceType:
"push | pull | static | dynamic",
isUnilateral:Boolean,
createdAt:Date,
updatedAt:Date
}

⸻

Note on option IDs

Stable IDs for category, primaryMuscles/secondaryMuscles, equipment, goals, mechanic, forceType, difficulty, movementType, reviewStatus, and contentTier are defined in server/src/features/exercises/exercise.constants.ts. This document intentionally does not duplicate that list — check the constants file for the current authoritative set.

Two data sources, one collection

~2,889 exercises come from the Kaggle "Gym Exercise Data" import (contentTier: "standard"); 16 come from the RepDB preview pack (contentTier: "enhanced" — richer structured data, goals/mechanic/forceType/isUnilateral populated, real images/animations). See docs/THIRD_PARTY_CONTENT.md for attribution and licensing on both sources — the RepDB pack is CC BY-NC 4.0, non-commercial use only. goals, mechanic, forceType, and isUnilateral are only populated for the enhanced subset today; they're optional fields, not required, for exactly that reason.

Superseded fields

muscleGroups (flat, undifferentiated) was replaced by primaryMuscles/secondaryMuscles for filtering precision — same reasoning as the original push/pull/legs/core → upper_body/back/core/lower_body category change. media.image/gif/video are unchanged and still populated for both tiers; gallery and animationUrl are additive, enhanced-tier-only fields, not replacements.

⸻

6. Workout Templates Collection

Purpose

Pre-built workouts created by ATLAS.

Examples:

* Push Day
* Beginner Full Body
* Strength Program

⸻

Collection:

workoutTemplates

⸻

Schema:

{
_id:ObjectId,
name:String,
description:String,
goal:[
"strength",
"hypertrophy",
"endurance"
],
difficulty:String,
duration:Number,
category:String,
exercises:[
{
exerciseId:ObjectId,
order:Number,
defaultSets:Number,
defaultReps:String,
defaultWeight:Number,
restTime:Number
}
],
createdBy:ObjectId|null,
createdAt:Date,
updatedAt:Date
}

⸻

One collection, two authors

createdBy is additive to the originally documented schema. null/absent means an ATLAS ready-made template (Phase 5 seeds 5 of these — one per category); a real user id means a template the user built themselves in the Workout Builder. Both are the same shape and the same collection — Principle 2 ("Separate Templates From Reality") is about templates vs. completed sessions, not about who authored a template, so a user's own saved workout is still a template until it's actually performed. defaultWeight is additive too: the roadmap's Workout Builder explicitly lets a user set a target weight per exercise, which the original schema draft didn't anticipate; it's optional since ATLAS's own ready-made templates don't set one (weight is inherently personal).

⸻

7. User Workouts Collection

Purpose

Stores actual completed workouts.

This is one of the most important collections.

⸻

Collection:

workouts

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
templateId:ObjectId|null,
name:String,
date:Date,
duration:Number,
status:
"in_progress | completed | abandoned",
exercises:[
{
exerciseId:ObjectId,
sets:[
{
setNumber:Number,
weight:Number,
reps:Number,
completed:Boolean
}
]
}
],
totalVolume:Number,
rating:Number,
notes:String,
photo:String,
createdAt:Date,
updatedAt:Date
}

⸻

in_progress is additive to the originally documented "completed | abandoned" pair. Phase 6's active workout screen persists the session the moment it starts (rather than only on finish) so a lost connection or closed tab at the gym doesn't lose logged sets — that needs a third state for "started, not yet resolved." Only one in_progress workout exists per user at a time; starting a new one while one is active resumes it instead of creating a second.

photo has no upload UI yet — the field is reserved but unused; building real photo storage is out of scope for Phase 6 and left for later.

⸻

8. Activities Collection

Purpose

Track sports outside the gym.

⸻

Collection:

activities

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
type:
"running | surf | skate | boxing | yoga",
date:Date,
duration:Number,
difficulty:Number,
distance:Number|null,
metadata:{
board:String,
location:String,
notes:String
},
createdAt:Date
}

⸻

9. Progress Collection

Purpose

Body and performance tracking.

⸻

Collection:

progress

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
date:Date,
weight:Number,
bodyMeasurements:{
chest:Number,
waist:Number,
legs:Number
},
photos:[String],
notes:String
}

⸻

10. Personal Records Collection

Purpose

Track achievements.

⸻

Collection:

personalRecords

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
exerciseId:ObjectId,
previousValue:Number,
newValue:Number,
type:
"weight | reps",
date:Date
}

⸻

Phase 6 implements weight (heaviest completed set ever, per exercise) and reps (most reps completed in a single set, per exercise) detection on finishing a workout — the simplest, most literal reading of "PR." volume, described in earlier drafts, is deferred; the field isn't populated today. previousValue defaults to 0 when no prior record exists, so a exercise's first-ever completed set is itself a PR — consistent, if generous, and avoids a special case for "no history yet."

⸻

Example:

User:

Bench press:

Previous:
60kg

New:
65kg

Create record.

⸻

11. Achievements Collection

Purpose

Gamification system.

⸻

Collection:

achievements

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
type:
"new_pr",
"streak",
"milestone",
title:String,
description:String,
date:Date
}

⸻

12. Conversations Collection

Purpose

Store AI conversations.

⸻

Collection:

conversations

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
messages:[
{
role:
"user | atlas",
content:String,
timestamp:Date
}
]
}

⸻

13. AI Memory Collection

Purpose

Long-term personalization.

⸻

Collection:

aiMemory

⸻

Schema:

{
_id:ObjectId,
userId:ObjectId,
memories:[
{
category:
"preference | behavior | goal",
key:String,
value:String,
confidence:Number
}
]
}

⸻

Examples:

User prefers evening workouts
User dislikes long cardio sessions
User enjoys upper body training

⸻

14. Knowledge Chunks Collection

Purpose

RAG knowledge base.

⸻

Collection:

knowledgeChunks

⸻

Schema:

{
_id:ObjectId,
content:String,
embedding:[Number],
metadata:{
type:
"exercise | training | recovery",
source:String,
exerciseId:ObjectId|null
},
createdAt:Date
}

⸻

15. Indexes

Important indexes:

⸻

Users:

email

Unique.

⸻

Workouts:

userId + date

⸻

Exercises:

name
category
muscleGroups

⸻

AI Memory:

userId

⸻

Knowledge:

Vector index:

embedding

⸻

16. Database Relationships

User → Workouts

One user:

Many workouts

⸻

User → Activities

One user:

Many activities

⸻

Exercise → Workout

Many workouts:

Many exercises

⸻

User → AI Memory

One user:

Many memories

⸻

17. AI Context Retrieval Example

When user asks:

“Create today’s workout”

ATLAS retrieves:

From Users:

* Goals
* Injuries
* Preferences

From Workouts:

* Recent sessions
* Performance

From Exercises:

* Available movements

From Knowledge:

* Training principles

Then generates recommendation.

⸻

18. MVP Database Priority

Required:

Phase 1:

users

exercises

workouts

Phase 2:

workoutTemplates

progress

Phase 3:

aiMemory

conversations

Phase 4:

knowledgeChunks

personalRecords

achievements

⸻

End of Database Schema