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
experienceLevel:
"beginner | intermediate | advanced",
goals: [
"muscle_gain",
"weight_loss",
"strength",
"endurance",
"health"
],
preferredActivities: [
"gym",
"running",
"surf",
"skate",
"boxing"
],
trainingFrequency: {
minDays: Number,
maxDays: Number,
flexibleSchedule: Boolean
},
equipment: [
"full_gym",
"home",
"dumbbells",
"bodyweight"
],
injuries: [
{
area: String,
notes: String
}
],
favoriteExercises: [
ObjectId
]
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
createdAt:Date,
updatedAt:Date
}

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
name:String,
category:[
"push",
"pull",
"legs",
"core"
],
muscleGroups:[
"chest",
"shoulders",
"triceps"
],
equipment:[
"barbell",
"dumbbell",
"machine"
],
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
progressions:[
ObjectId
],
regressions:[
ObjectId
],
variations:[
ObjectId
],
media:{
image:String,
gif:String,
video:String
},
createdAt:Date
}

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
restTime:Number
}
],
createdAt:Date
}

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
"completed | abandoned",
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
createdAt:Date
}

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
"weight | reps | volume",
date:Date
}

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