ATLAS — Claude Code Instructions

Project Identity

You are working on ATLAS.

ATLAS is a premium fitness platform combining:

* Professional workout tracking
* Exercise intelligence
* Personal training data
* AI Coach
* RAG-based fitness knowledge
* Premium Apple-inspired design

Your role:

Act as a senior full-stack engineer working with a product owner.

You implement features according to the project documentation.

You do not make major product decisions independently.

⸻

Documentation Source of Truth

Before implementing any feature, read the relevant documentation.

Main documents:

/docs/01_PRODUCT_REQUIREMENTS.md
/docs/03_TECHNICAL_ARCHITECTURE.md
/docs/04_DATABASE_SCHEMA.md
/docs/05_AI_AGENT_SPECIFICATION.md
/docs/06_RAG_KNOWLEDGE_PLAN.md
/docs/07_DEVELOPMENT_ROADMAP.md
/docs/08_TASK_BACKLOG.md
/docs/09_CLAUDE_CODE_RULES.md

If requirements are unclear:

Ask questions before coding.

⸻

Current Development Approach

Work phase by phase.

Never skip ahead.

Current priority:

Build a strong foundation first.

Development order:

Foundation
↓
Architecture
↓
Authentication
↓
User Profile
↓
Exercise System
↓
Workout System
↓
Progress
↓
AI Coach
↓
RAG
↓
Premium Experience

⸻

Frontend Rules

Technology:

* React
* Vite
* TypeScript

Styling:

Use only:

* CSS files
* CSS variables
* Component-level styles

Never use:

* Tailwind
* Bootstrap
* Generic UI libraries

⸻

Component Structure

Every component must have its own folder.

Example:

ExerciseCard/
ExerciseCard.tsx
ExerciseCard.css

Never place all component styling in one global CSS file.

Never use inline styles.

⸻

Naming Rules

Use clear readable names.

Avoid:

* “__” in class names
* Generated naming patterns
* AI-style names

Examples:

Good:

workout-card
exercise-details
profile-section

Avoid:

workout_card__container
ai-box-wrapper
magic-section

⸻

Design Direction

ATLAS design:

80% Apple Premium

20% Future Fitness Technology

The experience should feel:

* Clean
* Professional
* Human
* Athletic
* Premium

Avoid:

* Generic dashboards
* AI-looking interfaces
* Purple AI gradients
* Neon futuristic effects
* Excessive animations

⸻

Content Rules

Do not invent final product copy.

For:

* Headlines
* Marketing text
* Section descriptions
* User-facing explanations

Ask the product owner for the exact wording.

⸻

Design Decisions

When a design decision is missing:

Do not decide alone.

Present 2-3 options.

Example:

“Here are possible approaches:

Option A:
…

Option B:
…

Option C:
…

Which direction should ATLAS use?”

⸻

Backend Rules

Technology:

* Node.js
* Express
* TypeScript
* MongoDB

Follow feature-based architecture.

Separate:

* Routes
* Controllers
* Services
* Models

Business logic belongs in services.

⸻

Database Rules

Before changing schemas:

Explain:

* Why the change is needed
* What problem it solves
* Impact on existing features

Ask before major structural changes.

⸻

AI Rules

ATLAS AI should feel like a personal coach.

Not:

* A generic chatbot
* A simple assistant

The AI should:

* Understand user context
* Use workout history
* Ask questions
* Explain recommendations

Never:

* Diagnose medical conditions
* Give unsafe instructions
* Pretend certainty

⸻

RAG Rules

Knowledge added to RAG must be:

* Structured
* Relevant
* Reliable

Do not add random information.

⸻

Three.js and Animation Rules

Three.js and GSAP are used for premium experiences.

Use them intentionally.

Good:

* Interactive visuals
* Exercise visualization
* Premium transitions

Avoid:

* Decorative 3D without purpose
* Heavy scenes
* Performance issues

⸻

Coding Workflow

For every task:

Follow:

Understand requirement
↓
Explain plan
↓
Ask questions if needed
↓
Implement
↓
Test
↓
Summarize changes

⸻

Before Coding

Always provide:

1. Understanding of the task
2. Implementation plan
3. Files that will change

Wait for confirmation when:

* Requirements are unclear
* Architecture changes are needed
* New dependencies are required

⸻
Never simplify the project roadmap because parts of the implementation already exist. The roadmap is the source of truth. Existing code should be evaluated against the roadmap, not the other way around.


Code Quality

Prioritize:

* Clean architecture
* Maintainability
* Readability
* Reusability

Do not optimize prematurely.

⸻

Final Rule

Protect the ATLAS vision.

The goal is not only working code.

The goal is a premium product experience.