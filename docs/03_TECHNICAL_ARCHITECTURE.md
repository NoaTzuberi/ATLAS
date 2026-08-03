ATLAS — Technical Architecture Document

Version 1.0

⸻

1. Purpose

This document defines the technical architecture of ATLAS.

It describes:

* Frontend architecture
* Backend architecture
* Database architecture
* AI architecture
* RAG architecture
* Folder structure
* Development principles
* Technology decisions

This document is the technical source of truth for development.

⸻

2. Technology Stack

Frontend

Framework:

React + Vite

Language:

TypeScript

⸻

Libraries:

Routing

React Router

Purpose:

Application navigation.

⸻

3D

Three.js

React Three Fiber

Purpose:

* Interactive 3D experiences
* Exercise visualization
* Premium visual elements

⸻

Animation

GSAP

Purpose:

* Page transitions
* Hero animations
* Micro interactions

⸻

Styling

Pure CSS.

Rules:

No Tailwind.

No Bootstrap.

No generic UI frameworks.

No inline styles.

⸻

Component styling approach:

Every component owns its CSS.

Example:

ExerciseCard/
ExerciseCard.tsx
ExerciseCard.css

⸻

3. Frontend Architecture

Architecture Pattern

Feature-based architecture.

Avoid large global folders.

⸻

Recommended structure:

src/
├── app/
│   ├── router/
│   ├── providers/
│   └── config/
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── workouts/
│   ├── exercises/
│   ├── progress/
│   ├── activities/
│   ├── coach/
│   └── profile/
├── components/
│   ├── common/
│   └── layout/
├── three/
│   ├── scenes/
│   ├── models/
│   └── animations/
├── services/
│   ├── api/
│   └── auth/
├── hooks/
├── types/
├── utils/
└── assets/

⸻

4. Frontend Feature Structure

Every feature follows the same pattern.

Example:

features/workouts/
├── components/
│   ├── WorkoutCard/
│   │   ├── WorkoutCard.tsx
│   │   └── WorkoutCard.css
│   │
│   ├── WorkoutBuilder/
│   │   ├── WorkoutBuilder.tsx
│   │   └── WorkoutBuilder.css
├── pages/
│   └── WorkoutsPage.tsx
├── hooks/
│   └── useWorkouts.ts
├── services/
│   └── workoutService.ts
├── types.ts

⸻

5. Frontend Development Rules

Component Rules

Every component must:

* Have a single responsibility
* Own its CSS
* Avoid duplicated logic
* Use TypeScript types

⸻

Forbidden:

Inline styles:

<div style={{color:"red"}}>

⸻

Allowed:

<div className="exercise-card">

with:

.exercise-card {
}

⸻

6. Design System Architecture

The design system is custom built.

No external component libraries.

⸻

Global:

styles/
├── variables.css
├── typography.css
├── animations.css
└── globals.css

⸻

Contains:

* Colors
* Spacing
* Typography
* Shadows
* Glass effects

⸻

Component styles remain local.

⸻

7. 3D Architecture

3D is an enhancement layer.

It should not control business logic.

⸻

Structure:

three/
├── scenes/
│   ├── HeroScene.tsx
│   └── ExerciseScene.tsx
├── models/
│   └── AthleteModel.tsx
├── materials/
├── animations/
└── utils/

⸻

3D Usage Rules

Use 3D for:

Hero

Purpose:

Premium first impression.

Examples:

* Athlete model
* Data visualization
* Motion

⸻

Exercise Experience

Purpose:

Understanding movement.

Examples:

* Muscle highlighting
* Body visualization

⸻

Avoid:

* Random decorative objects
* Heavy scenes
* Performance issues

⸻

8. Backend Architecture

Technology:

Node.js

Framework:

Express

Language:

JavaScript or TypeScript

Recommendation:

TypeScript preferred.

⸻

Architecture style:

Feature-based backend.

⸻

Structure:

server/
├── src/
│
├── config/
│
├── database/
│
├── middleware/
│
├── features/
│
│   ├── auth/
│   │
│   ├── users/
│   │
│   ├── exercises/
│   │
│   ├── workouts/
│   │
│   ├── activities/
│   │
│   ├── progress/
│   │
│   └── ai/
│
├── services/
├── utils/
└── app.ts

⸻

9. Backend Feature Structure

Example:

workouts/
├── workout.controller.ts
├── workout.service.ts
├── workout.routes.ts
├── workout.model.ts
├── workout.validation.ts

⸻

Responsibilities:

Controller:

Handles HTTP requests.

⸻

Service:

Business logic.

⸻

Model:

Database structure.

⸻

Routes:

API endpoints.

⸻

10. Database Architecture

Database:

MongoDB

Reason:

ATLAS contains highly flexible data:

* Exercises
* Activities
* User preferences
* AI memory
* Workout history

MongoDB fits dynamic fitness data.

⸻

Collections:

users
exercises
workoutTemplates
workouts
activities
progress
conversations
aiMemory
knowledgeChunks

⸻

11. Authentication Architecture

Method:

JWT

Flow:

User
↓
Login/Register
↓
Backend validates
↓
JWT generated
↓
Frontend stores token
↓
Protected requests include token
↓
Middleware verifies token

⸻

Protected examples:

* User profile
* Workouts
* Progress
* AI conversations

⸻

12. AI Architecture

ATLAS AI consists of:

AI Agent
+
Memory System
+
RAG Knowledge
+
Tools

⸻

13. AI Agent Layer

Responsibilities:

* Understand user intent
* Decide actions
* Call tools
* Generate responses

⸻

Example:

User:

“Create me a leg workout”

Agent:

1. Gets user profile
2. Checks goals
3. Checks injuries
4. Retrieves exercise knowledge
5. Creates workout
6. Saves workout

⸻

14. AI Tools

The agent can access:

getUserProfile()
getWorkoutHistory()
getFavoriteExercises()
getExerciseDetails()
createWorkout()
modifyWorkout()
analyzeProgress()

⸻

15. RAG Architecture

Purpose:

Give ATLAS reliable fitness knowledge.

⸻

Flow:

Knowledge Documents
↓
Chunking
↓
Embeddings
↓
Vector Database
↓
Retriever
↓
LLM Context
↓
AI Response

⸻

Knowledge sources:

* Exercise database
* Training principles
* Recovery information
* Coaching rules

⸻

16. AI Memory Architecture

Memory types:

⸻

Long Term Memory

Examples:

User prefers:

* Morning workouts
* Upper body focus

⸻

Training Memory

Examples:

* Previous weights
* PRs
* Training frequency

⸻

Conversation Memory

Examples:

Previous coach discussions.

⸻

17. API Communication

Frontend communicates only through backend APIs.

Never directly access database.

⸻

Example:

Frontend:

GET /api/workouts

Backend:

Controller
↓
Service
↓
MongoDB

⸻

18. Environment Configuration

Required:

Frontend:

.env
VITE_API_URL=

Backend:

.env
DATABASE_URL=
JWT_SECRET=
AI_API_KEY=

⸻

19. Development Principles

Clean Architecture

Code should be:

* Maintainable
* Modular
* Easy to extend

⸻

Ask Before Changing Architecture

Claude Code must:

* Explain architectural changes
* Ask permission before major decisions

⸻

No Unauthorized Libraries

Before adding:

* npm package
* framework
* architecture change

Ask first.

⸻

20. Performance Principles

Important:

* Lazy load heavy 3D
* Optimize assets
* Avoid unnecessary renders
* Keep animations smooth

⸻

21. Security Principles

Required:

* Password hashing
* JWT validation
* Input validation
* Protected endpoints
* Environment variables

⸻

End of Technical Architecture