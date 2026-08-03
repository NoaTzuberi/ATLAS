ATLAS — Project Setup Guide

Version 1.0

⸻

1. Setup Philosophy

ATLAS should be built with a clean professional foundation.

The initial setup should prioritize:

* Maintainable architecture
* Clear separation between frontend and backend
* Feature-based organization
* Scalable structure

The developer should create the base structure manually before asking Claude Code to implement features.

⸻

2. Required Technology Stack

Frontend

Required:

* React
* Vite
* TypeScript

Additional:

* React Router
* Axios
* Three.js
* React Three Fiber
* GSAP

Styling:

* Pure CSS only

Forbidden:

* Tailwind CSS
* Bootstrap
* Generic UI libraries
* Component libraries that control styling

⸻

Backend

Required:

* Node.js
* Express
* TypeScript

Database:

* MongoDB

Authentication:

* JWT

⸻

AI Layer

Architecture:

* AI Agent
* Tools
* RAG system
* Vector search

⸻

3. Initial Folder Structure

Create:

ATLAS/
├── client/
├── server/
├── docs/
└── README.md

⸻

4. Frontend Setup

Location:

ATLAS/client

Create:

npm create vite@latest client -- --template react-ts

Install:

npm install

⸻

5. Frontend Dependencies

Install:

npm install react-router-dom axios

Animation:

npm install gsap

3D:

npm install three @react-three/fiber @react-three/drei

⸻

6. Frontend Structure

Inside:

client/src

Create:

src/
├── assets/
├── components/
├── features/
├── layouts/
├── pages/
├── hooks/
├── services/
├── types/
├── utils/
├── three/
├── styles/
├── App.tsx
└── main.tsx

⸻

7. Component Structure Rules

Every component must have its own folder.

Example:

components/
└── GlassCard/
    ├── GlassCard.tsx
    └── GlassCard.css

⸻

Do not create:

styles/
all-components.css

⸻

8. Feature Structure

Large features should be isolated.

Example:

features/
└── workouts/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/
    └── types/

⸻

Recommended features:

features/
├── auth
├── onboarding
├── exercises
├── workouts
├── progress
├── ai-coach
└── profile

⸻

9. Global Styling Setup

Create:

styles/
├── variables.css
├── globals.css
└── animations.css

⸻

variables.css:

Contains:

* Colors
* Typography variables
* Spacing
* Shadows

⸻

globals.css:

Contains:

* Reset
* Body styles
* Global defaults

⸻

animations.css:

Contains:

* Shared animations only

⸻

10. Backend Setup

Location:

ATLAS/server

Initialize:

npm init -y

Install:

npm install express mongoose dotenv cors bcrypt jsonwebtoken

Development:

npm install -D typescript ts-node nodemon

⸻

11. Backend Structure

Create:

server/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
│
├── .env
└── package.json

⸻

12. Backend Feature Structure

Each feature:

Example:

modules/
└── users/
    ├── user.model.ts
    ├── user.controller.ts
    ├── user.service.ts
    ├── user.routes.ts
    └── user.validation.ts

⸻

13. Environment Variables

Create:

Frontend:

.env

Backend:

.env

Never commit:

* API keys
* JWT secrets
* Database credentials

⸻

14. Git Setup

Initial commit:

git init
git add .
git commit -m "Initial ATLAS project setup"

Recommended branches:

main
development
feature/*

⸻

15. Claude Code Initial Workflow

Before writing code:

Provide:

1. Project documentation.
2. Current task.
3. Relevant phase.

Example:

“I want to implement Phase 2.1 Authentication according to the PRD.”

⸻

Claude should:

1. Read requirements.
2. Explain implementation.
3. Ask questions.
4. Implement.

⸻

16. Claude Skills Setup

Claude should have access to:

Frontend

Skills:

* React
* TypeScript
* CSS Architecture

⸻

Animation

Skills:

* GSAP

Use for:

* Page transitions
* Micro interactions
* Motion design

⸻

3D

Skills:

* Three.js
* React Three Fiber

Use for:

* Premium visuals
* Exercise visualization
* Interactive elements

⸻

Backend

Skills:

* Node.js
* Express
* MongoDB
* JWT

⸻

AI

Skills:

* LLM integration
* Agent architecture
* RAG systems
* Vector databases

⸻

17. Three.js Implementation Rules

Three.js should not be introduced immediately.

Order:

1. Build working product.
2. Add visual layer.
3. Optimize.

⸻

First 3D goals:

Priority 1:

Authentication experience.

Priority 2:

Hero visual.

Priority 3:

Exercise visualization.

⸻

18. GSAP Implementation Rules

Animations should support:

* User understanding
* Premium feeling
* Feedback

Not:

* Decoration
* Distraction

⸻

19. Development Order

Follow:

Setup
↓
Design System
↓
Authentication
↓
User Profile
↓
Exercise Database
↓
Workout System
↓
Progress
↓
AI Agent
↓
RAG
↓
3D Experience
↓
Deployment

⸻

20. First Development Session Checklist

Before coding:

✓ Repository created

✓ Frontend created

✓ Backend created

✓ MongoDB connected

✓ Folder structure created

✓ Documentation added

✓ Git initialized

⸻

End of Project Setup Guide