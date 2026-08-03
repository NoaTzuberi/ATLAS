ATLAS — Development Roadmap

Version 1.0

⸻

1. Development Philosophy

ATLAS will be developed incrementally.

Each phase must:

* Have clear goals
* Produce working functionality
* Be testable
* Avoid unnecessary complexity

⸻

Overall Development Phases

Phase 0
Project Foundation
↓
Phase 1
Frontend Architecture + Design System
↓
Phase 2
Authentication + User System
↓
Phase 3
Onboarding + Personalization
↓
Phase 4
Exercise Library
↓
Phase 5
Workout System
↓
Phase 6
Workout Execution Mode
↓
Phase 7
Progress Tracking
↓
Phase 8
AI Agent + RAG
↓
Phase 9
Premium Experience + 3D
↓
Phase 10
Deployment + Presentation

⸻

PHASE 0 — Project Foundation

Goal

Create a clean professional development environment.

⸻

0.1 Create Repository

Tasks:

* Create Git repository
* Define branch strategy
* Add README
* Add documentation folder

Structure:

ATLAS/
├── client/
├── server/
├── docs/
└── README.md

⸻

0.2 Setup Frontend

Technology:

* React
* Vite
* TypeScript

Tasks:

* Create React project
* Configure TypeScript
* Install dependencies

Required:

* React Router
* Axios
* Three.js
* React Three Fiber
* GSAP

⸻

0.3 Setup Backend

Technology:

* Node.js
* Express
* TypeScript

Tasks:

* Create server
* Configure environment variables
* Create basic API route

Test:

GET /api/health

⸻

0.4 Database Setup

Tasks:

* Create MongoDB database
* Connect backend
* Create database configuration

⸻

PHASE 1 — Frontend Architecture

Goal

Create the visual foundation.

⸻

1.1 Folder Structure

Create:

src/
features/
components/
services/
hooks/
types/
three/
assets/

⸻

1.2 Design System

Create:

Global:

styles/
variables.css
globals.css
typography.css
animations.css

Define:

Colors:

* Deep navy
* Orange accent
* Glass surfaces

Typography:

* Headings
* Body
* Labels

⸻

1.3 Layout System

Create:

Components:

Navbar
PageLayout
GlassCard
Button
Modal

Rules:

Every component:

Component.tsx
Component.css

⸻

1.4 Landing Page

Create:

Sections:

* Hero
* Features
* AI explanation
* CTA

No video in hero.

Add:

* GSAP animations
* Premium transitions

⸻

PHASE 2 — Authentication System

Goal

Create secure user access.

⸻

2.1 Backend Authentication

Tasks:

Create:

User model

Auth routes:

POST /register
POST /login

Implement:

* Password hashing
* JWT generation

⸻

2.2 Frontend Authentication

Create:

Pages:

Login
Register

Components:

AuthCard
InputField

⸻

2.3 Protected Routes

Implement:

JWT validation.

Protected:

* Dashboard
* Profile
* Workouts

⸻

PHASE 3 — User Onboarding

Goal

Understand the user.

⸻

3.1 Create Onboarding Flow

Screens:

Basic information

⸻

Goals

Multiple selection.

⸻

Training frequency

Support:

* Range
* Flexible schedule

⸻

Activities

Multiple selection.

⸻

Equipment

⸻

Exercise preferences

⸻

Recovery limitations

⸻

3.2 Save User Profile

Backend:

Create:

PUT /users/profile

⸻

3.3 AI Context Preparation

Prepare:

User context object.

Example:

{
goal:"strength",
experience:"beginner",
preferences:[]
}

⸻

PHASE 4 — Exercise Intelligence System

Goal

Create exercise foundation.

⸻

4.1 Exercise Database

Create:

Exercise schema.

⸻

4.2 Exercise API

Endpoints:

GET /exercises
GET /exercises/:id

⸻

4.3 Exercise Library UI

Create:

Cards showing:

* Name
* Muscle group
* Equipment
* Difficulty
* Media

⸻

4.4 Exercise Detail Page

Include:

* Video/GIF
* Instructions
* Mistakes
* Tips

⸻

PHASE 5 — Workout System

Goal

Allow users to create and save workouts.

⸻

5.1 Workout Templates

Create:

Ready-made workouts.

Categories:

* Push
* Pull
* Legs
* Full body
* Core

⸻

5.2 Workout Builder

Features:

Add exercises.

Change order.

Set:

* Sets
* Reps
* Weight

Save workout.

⸻

5.3 User Workout Storage

Store:

Created workouts.

⸻

PHASE 6 — Workout Execution Mode

Goal

Create the Hevy/Hive level experience.

⸻

6.1 Active Workout Screen

Features:

* Current exercise
* Sets
* Reps
* Weight

⸻

6.2 Weight Memory

System remembers:

Previous performance.

Example:

Last time:

25kg x 10

Today suggestion:

25kg x 10

⸻

6.3 Personal Records

Detect:

* Weight increase
* Rep increase

Create:

Achievement notification.

⸻

6.4 Workout Summary

Display:

* Duration
* Volume
* PRs
* Notes
* Photo

⸻

PHASE 7 — Progress System

Goal

Visualize improvement.

⸻

Features:

Dashboard:

* Workout streak
* Strength changes
* Weight tracking

⸻

Calendar:

Display:

* Gym sessions
* Sports activities

⸻

PHASE 8 — AI Coach System

Goal

Create ATLAS intelligence.

⸻

8.1 AI Infrastructure

Setup:

* LLM connection
* Agent layer
* Tools

⸻

8.2 Create Core Agent

Capabilities:

* Conversation
* Context understanding

⸻

8.3 Create Tools

Implement:

getUserProfile()
getWorkoutHistory()
createWorkout()
modifyWorkout()
analyzeProgress()

⸻

8.4 RAG System

Tasks:

Create knowledge documents.

Process:

* Chunking
* Embeddings
* Retrieval

⸻

8.5 AI Workout Generation

Example:

User:

“Create me a 45 minute workout”

ATLAS:

Generates workout.

⸻

PHASE 9 — Premium Experience

Goal

Create WOW factor.

⸻

9.1 Three.js Integration

Add:

Hero 3D element.

⸻

9.2 Exercise Visualization

Add:

3D body/exercise visualization.

⸻

9.3 GSAP Motion

Add:

* Page transitions
* Micro interactions
* Achievement animations

⸻

9.4 Authentication Cinematic Experience

Add:

Background video.

Examples:

* Running
* Surf
* Training

⸻

PHASE 10 — Deployment

Goal

Prepare final presentation.

⸻

Tasks:

Frontend:

Deploy.

Backend:

Deploy.

Database:

Cloud setup.

⸻

Testing:

* Authentication
* Main flows
* AI responses
* Performance

⸻

Presentation Preparation

Prepare:

Demo Flow

Landing

Register

Onboarding

Dashboard

Create workout

Execute workout

AI coach

Progress

⸻

Explain:

Challenge:

Example:

AI + RAG integration.

Solution:

Architecture and implementation.

⸻

End of Development Roadmap