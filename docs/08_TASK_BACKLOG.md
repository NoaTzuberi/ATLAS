ATLAS — Task Backlog

Version 1.0

⸻

Task Management Rules

Priority Levels

P0 — Must Have

Required for MVP and final presentation.

⸻

P1 — Important

Strongly recommended if time allows.

⸻

P2 — Future Enhancement

Nice-to-have features.

⸻

Status

Possible values:

* Todo
* In Progress
* Review
* Done

⸻

Complexity

* Small
* Medium
* Large

⸻

EPIC 0 — Project Foundation

Goal

Create professional development environment.

⸻

Story 0.1 — Repository Setup

Task 0.1.1

Create project repository.

Priority:

P0

Complexity:

Small

Status:

Todo

⸻

Task 0.1.2

Create project documentation structure.

Create:

docs/
PRD
Architecture
Database
AI
Roadmap

Priority:

P0

Complexity:

Small

⸻

Story 0.2 — Frontend Initialization

Task 0.2.1

Create React + Vite + TypeScript application.

Priority:

P0

Complexity:

Small

⸻

Task 0.2.2

Install frontend dependencies.

Required:

* React Router
* Axios
* Three.js
* React Three Fiber
* GSAP

Priority:

P0

Complexity:

Small

⸻

Story 0.3 — Backend Initialization

Task 0.3.1

Create Express + TypeScript server.

Priority:

P0

Complexity:

Medium

⸻

Task 0.3.2

Create API health endpoint.

Example:

GET /api/health

Priority:

P0

Complexity:

Small

⸻

Story 0.4 — Database Setup

Task 0.4.1

Create MongoDB database.

Priority:

P0

Complexity:

Small

⸻

Task 0.4.2

Connect backend to MongoDB.

Priority:

P0

Complexity:

Medium

⸻

⸻

EPIC 1 — Design System

Goal

Create ATLAS premium visual identity.

⸻

Story 1.1 — Global Styling

Task 1.1.1

Create CSS variables.

Include:

* Colors
* Typography
* Spacing
* Shadows

Priority:

P0

Complexity:

Medium

⸻

Task 1.1.2

Create global CSS reset.

Priority:

P0

Complexity:

Small

⸻

Story 1.2 — Reusable Components

Create:

Task 1.2.1

GlassCard component

Priority:

P0

⸻

Task 1.2.2

Button component

Priority:

P0

⸻

Task 1.2.3

Input component

Priority:

P0

⸻

Story 1.3 — Animation System

Task 1.3.1

Setup GSAP utilities.

Priority:

P1

⸻

Task 1.3.2

Create page transition system.

Priority:

P1

⸻

⸻

EPIC 2 — Authentication

Goal

Secure user accounts.

⸻

Story 2.1 — Backend Authentication

Task 2.1.1

Create User model.

Priority:

P0

Depends on:

Database setup

⸻

Task 2.1.2

Create register endpoint.

POST /api/auth/register

Priority:

P0

⸻

Task 2.1.3

Create login endpoint.

POST /api/auth/login

Priority:

P0

⸻

Task 2.1.4

Implement password hashing.

Priority:

P0

⸻

Task 2.1.5

Implement JWT authentication middleware.

Priority:

P0

⸻

Story 2.2 — Frontend Authentication

Task 2.2.1

Create Login page.

Priority:

P0

⸻

Task 2.2.2

Create Register page.

Priority:

P0

⸻

Task 2.2.3

Create protected routes.

Priority:

P0

⸻

EPIC 3 — User Onboarding

Goal

Build user understanding system.

⸻

Story 3.1 — Profile Collection

Task 3.1.1

Create onboarding flow.

Steps:

* Basic info
* Goals
* Frequency
* Activities
* Equipment
* Preferences
* Recovery

Priority:

P0

Complexity:

Large

⸻

Task 3.1.2

Create multi-select components.

Priority:

P0

⸻

Task 3.1.3

Save profile to backend.

Priority:

P0

⸻

Story 3.2 — User Personalization

Task 3.2.1

Create user context object.

Priority:

P1

⸻

⸻

EPIC 4 — Exercise Intelligence

Goal

Create exercise foundation.

⸻

Story 4.1 — Exercise Database

Task 4.1.1

Create Exercise model.

Priority:

P0

⸻

Task 4.1.2

Create initial exercise dataset.

Minimum:

100 exercises

Priority:

P1

⸻

Story 4.2 — Exercise Library

Task 4.2.1

Create exercise cards.

Display:

* Name
* Muscle
* Equipment
* Difficulty

Priority:

P0

⸻

Task 4.2.2

Create exercise details page.

Include:

* Video/GIF
* Instructions
* Mistakes
* Tips

Priority:

P1

⸻

EPIC 5 — Workout System

Goal

Create workout creation and management.

⸻

Story 5.1 — Workout Templates

Task 5.1.1

Create workout template schema.

Priority:

P0

⸻

Task 5.1.2

Create workout library.

Categories:

* Push
* Pull
* Legs
* Full body
* Core

Priority:

P1

⸻

Story 5.2 — Workout Builder

Task 5.2.1

Create exercise selector.

Priority:

P0

⸻

Task 5.2.2

Allow adding exercises.

Priority:

P0

⸻

Task 5.2.3

Allow editing:

* Sets
* Reps
* Weight

Priority:

P0

⸻

Task 5.2.4

Save workout.

Priority:

P0

⸻

EPIC 6 — Workout Mode

Goal

Create Hevy/Hive level experience.

⸻

Story 6.1 — Active Workout

Task 6.1.1

Create workout execution screen.

Priority:

P0

⸻

Task 6.1.2

Create set completion tracking.

Priority:

P0

⸻

Task 6.1.3

Create workout timer.

Priority:

P0

⸻

Story 6.2 — Smart Weight Memory

Task 6.2.1

Load previous exercise performance.

Priority:

P0

⸻

Task 6.2.2

Suggest previous weight.

Priority:

P1

⸻

Story 6.3 — Personal Records

Task 6.3.1

Detect PR.

Examples:

* Weight increase
* Rep increase

Priority:

P1

⸻

Task 6.3.2

Create achievement animation.

Priority:

P1

⸻

EPIC 7 — Progress System

⸻

Story 7.1 — Dashboard

Task 7.1.1

Create dashboard layout.

Priority:

P0

⸻

Task 7.1.2

Add progress cards.

Priority:

P1

⸻

Story 7.2 — Activity Tracking

Task 7.2.1

Create sport activity model.

Priority:

P1

⸻

Activities:

* Running
* Surf
* Skate
* Boxing

⸻

EPIC 8 — AI Coach

Goal

Create ATLAS intelligence.

⸻

Story 8.1 — AI Infrastructure

Task 8.1.1

Connect LLM API.

Priority:

P0

⸻

Task 8.1.2

Create AI service layer.

Priority:

P0

⸻

Story 8.2 — Agent Tools

Create:

Task 8.2.1

getUserProfile()

Priority:

P0

⸻

Task 8.2.2

getWorkoutHistory()

Priority:

P0

⸻

Task 8.2.3

createWorkout()

Priority:

P0

⸻

Task 8.2.4

modifyWorkout()

Priority:

P1

⸻

EPIC 9 — RAG System

⸻

Story 9.1 — Knowledge Base

Task 9.1.1

Create knowledge document structure.

Priority:

P0

⸻

Task 9.1.2

Create exercise knowledge files.

Priority:

P1

⸻

Story 9.2 — Retrieval System

Task 9.2.1

Create embeddings pipeline.

Priority:

P1

⸻

Task 9.2.2

Connect retrieval to AI Agent.

Priority:

P1

⸻

EPIC 10 — Premium Experience

⸻

Story 10.1 — Three.js

Task 10.1.1

Create hero 3D scene.

Priority:

P1

⸻

Task 10.1.2

Optimize 3D loading.

Priority:

P1

⸻

Story 10.2 — Exercise Visualization

Task 10.2.1

Add movement visualization.

Priority:

P2

⸻

Story 10.3 — Authentication Experience

Task 10.3.1

Add cinematic background video.

Priority:

P1

⸻

EPIC 11 — Deployment

⸻

Story 11.1

Deploy frontend.

Priority:

P0

⸻

Story 11.2

Deploy backend.

Priority:

P0

⸻

Story 11.3

Configure production database.

Priority:

P0

⸻

Final MVP Checklist

Before presentation:

✓ Authentication works

✓ JWT protection works

✓ User onboarding works

✓ Exercise library exists

✓ User can create workout

✓ User can complete workout

✓ Progress is saved

✓ AI Coach works

✓ RAG demonstration works

✓ Premium design exists

⸻

End of Task Backlog