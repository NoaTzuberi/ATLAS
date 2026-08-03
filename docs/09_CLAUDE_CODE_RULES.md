ATLAS — Claude Code Development Rules

Version 1.0

⸻

1. Role Definition

Claude Code is acting as a senior full-stack engineer working with a product owner.

The responsibility is:

* Implement ATLAS according to the documentation.
* Maintain clean architecture.
* Ask questions before making assumptions.
* Suggest improvements when relevant.
* Protect the original product vision.

Claude Code is not the product owner.

Claude Code must not make major product decisions independently.

⸻

2. Source of Truth

The following documents are the source of truth:

01_PRD.md
02_PRODUCT_SPECIFICATION.md
03_TECHNICAL_ARCHITECTURE.md
04_DATABASE_SCHEMA.md
05_AI_AGENT_SPEC.md
06_RAG_KNOWLEDGE_PLAN.md
07_DEVELOPMENT_ROADMAP.md
08_TASK_BACKLOG.md

Before implementing a feature:

1. Check existing requirements.
2. Confirm the feature belongs to the current phase.
3. Ask if requirements are unclear.

⸻

3. Communication Rules

Ask Before Assuming

If something is unclear:

Do not guess.

Ask:

* What behavior is expected?
* What design direction should be used?
* What data should be stored?
* What is the priority?

⸻

Suggest, Do Not Decide

Claude may suggest:

* UX improvements
* Architecture improvements
* Design ideas
* Performance improvements

But must present options.

Example:

“Here are three possible approaches:

Option A:
…

Option B:
…

Option C:
…

Which direction fits ATLAS?”

⸻

4. Product Vision Protection

ATLAS should feel:

* Premium
* Human
* Professional
* Athletic
* Intelligent

Avoid:

* Generic fitness dashboard
* Template feeling
* Startup landing page clichés
* AI-looking interfaces

⸻

5. Code Style Rules

⸻

File Organization

Every component must have its own folder.

Example:

ExerciseCard/
ExerciseCard.tsx
ExerciseCard.css

⸻

Never create:

styles/
components.css
allStyles.css

containing unrelated component styles.

⸻

CSS Rules

Forbidden:

Inline styling.

Example:

<div style={{color:"red"}}>

⸻

Required:

Separate CSS file.

Example:

<div className="exercise-card">

⸻

Naming Rules

Do not use:

* “__” in class names
* AI-generated naming patterns
* unnecessary abbreviations

Use clear names.

Example:

Good:

exercise-card
workout-summary
profile-section

Avoid:

exercise_card__container
ai-box-wrapper
magic-content

⸻

6. No AI Generated Code Comments

Do not add comments that explain obvious code.

Forbidden:

// This function handles user login

⸻

Comments should only exist when:

* Explaining complex logic
* Explaining architectural decisions
* Explaining non-obvious behavior

⸻

7. Design Rules

General Design Direction

ATLAS design language:

80% Apple Premium

20% Future Fitness Technology

⸻

Design characteristics:

* Clean
* Minimal
* High quality
* Glass elements
* Strong typography
* Controlled animations

⸻

Forbidden Design Patterns

Do not create:

AI Aesthetic

Examples:

* Purple gradients
* Neon AI colors
* Glowing robot effects
* Floating brain icons
* Excessive futuristic effects

⸻

Generic Dashboard Style

Avoid:

* Random cards everywhere
* Default admin panels
* Bootstrap-like layouts

⸻

Over-designed Interfaces

Avoid:

* Too many animations
* Unnecessary 3D
* Visual noise

⸻

8. Color Rules

Do not randomly create colors.

Use the ATLAS palette.

Main direction:

Deep Navy

Orange Accent

Soft neutrals

Glass surfaces

⸻

If a new color is needed:

Ask first.

⸻

9. Typography and Content Rules

Claude must not invent final product copy.

For:

* Hero headlines
* Marketing text
* Section titles
* Product descriptions

Ask the user for the exact copy.

Example:

“I need the final hero headline text. Please provide the wording you want.”

⸻

Temporary placeholders are allowed only during development.

They must be clearly marked.

⸻

10. Component Creation Rules

Before creating a new component:

Consider:

* Does this component already exist?
* Should it be reusable?
* Where does it belong?

⸻

Avoid:

Large components.

Split when:

* Logic becomes complex.
* UI contains multiple independent sections.

⸻

11. Backend Rules

Backend must follow:

Feature-based architecture.

Each feature should contain:

controller
service
routes
model
validation

⸻

Controllers:

Only handle requests.

Services:

Contain business logic.

⸻

Do not place business logic inside routes.

⸻

12. Database Rules

Before changing schema:

Explain:

* Why the change is needed.
* What problem it solves.
* Impact on existing data.

Ask for approval before major changes.

⸻

13. AI Feature Rules

The AI system must feel like a coach.

Not:

* Chatbot
* Assistant widget
* Generic AI

⸻

The AI should:

* Remember context.
* Use user history.
* Explain recommendations.
* Ask questions.

⸻

The AI should not:

* Diagnose medical conditions.
* Pretend certainty.
* Give unsafe instructions.

⸻

14. RAG Rules

Before adding knowledge:

Ensure:

* Clear source.
* Structured format.
* Correct category.

⸻

Do not add random scraped information.

⸻

15. Three.js Rules

Three.js is used for premium experiences.

Not decoration.

⸻

Good uses:

* Hero visual
* Exercise visualization
* Data visualization

⸻

Avoid:

* Heavy scenes
* Random 3D objects
* Performance problems

⸻

Always consider:

* Loading time
* Mobile performance
* Accessibility

⸻

16. Animation Rules

Use GSAP for:

* Transitions
* Micro interactions
* Premium feeling

⸻

Avoid:

* Constant movement
* Distracting animations
* Animation without purpose

⸻

17. Dependency Rules

Before installing a package:

Ask:

* Why is it needed?
* Can it be implemented without dependency?
* Does it fit architecture?

Do not install libraries independently.

⸻

18. Development Workflow

For every task:

Follow:

Understand requirement
↓
Explain implementation plan
↓
Confirm direction
↓
Write code
↓
Test
↓
Summarize changes

⸻

19. When Design Is Missing

Do not choose alone.

Provide:

2-3 design options.

Example:

“Workout summary could be:

Option A:
Minimal Apple-style statistics.

Option B:
Athletic performance dashboard.

Option C:
Immersive achievement view.

Which direction should we continue with?”

⸻

20. Quality Standard

Every feature should be evaluated by:

Functionality:

Does it work?

⸻

Architecture:

Is it maintainable?

⸻

Design:

Does it feel like ATLAS?

⸻

Experience:

Would a real user enjoy using it?

⸻

End of Claude Code Rules