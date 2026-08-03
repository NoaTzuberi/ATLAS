ATLAS — RAG Knowledge Plan

Version 1.0

⸻

1. Purpose

This document defines the knowledge architecture used by the ATLAS AI system.

The purpose of the RAG system is to provide the AI Coach with reliable fitness knowledge while keeping responses:

* Accurate
* Personalized
* Explainable
* Consistent

⸻

2. RAG Philosophy

ATLAS should not behave like a generic fitness chatbot.

The system should answer based on:

1. Professional fitness knowledge
2. Exercise database
3. User history
4. User goals
5. Training context

⸻

3. RAG Architecture

Flow:

Knowledge Sources
↓
Document Processing
↓
Chunking
↓
Embeddings
↓
Vector Database
↓
Retriever
↓
ATLAS Agent Context
↓
LLM Response

⸻

4. Knowledge Categories

The knowledge base is divided into domains.

⸻

Category 1 — Exercise Library

Priority:

★★★★★

The most important knowledge source.

⸻

Purpose:

Allow ATLAS to understand every movement.

⸻

Each exercise document should include:

Basic Information

Example:

Exercise:
Barbell Bench Press
Category:
Push
Muscles:
Chest
Triceps
Front Deltoid

⸻

Technique

Contains:

* Starting position
* Movement execution
* Breathing
* Range of motion

⸻

Common Mistakes

Examples:

* Elbows too wide
* Poor shoulder position
* Incorrect grip

⸻

Coaching Cues

Examples:

“Push the floor away”

“Keep your chest proud”

⸻

Variations

Examples:

Bench Press:

* Dumbbell Press
* Machine Press
* Incline Press

⸻

Progressions

Example:

Beginner:

Push-up

↓

Intermediate:

Bench Press

↓

Advanced:

Weighted Push-up

⸻

Regressions

For:

* Beginners
* Recovery
* Limitations

⸻

Category 2 — Training Principles

Priority:

★★★★★

⸻

Topics:

Progressive Overload

Knowledge:

* Increasing weight
* Increasing reps
* Increasing volume
* Improving technique

⸻

Strength Training

Includes:

* Rep ranges
* Rest periods
* Intensity

⸻

Hypertrophy

Includes:

* Muscle growth principles
* Volume
* Recovery

⸻

Endurance

Includes:

* Cardio principles
* Conditioning

⸻

Category 3 — Programming Knowledge

Priority:

★★★★☆

⸻

Purpose:

Help ATLAS create better programs.

⸻

Topics:

Split Types

Examples:

* Push Pull Legs
* Upper Lower
* Full Body

⸻

Workout Structure

Examples:

Order:

1. Compound movement
2. Secondary movement
3. Isolation
4. Core

⸻

Volume Management

Includes:

* Sets per muscle group
* Training frequency
* Recovery

⸻

Category 4 — Recovery Knowledge

Priority:

★★★★☆

⸻

Topics:

* Rest
* Sleep
* Mobility
* Stretching
* Recovery days

⸻

Important:

The system does not diagnose injuries.

⸻

Category 5 — Injury-Aware Training

Priority:

★★★★☆

⸻

Purpose:

Modify training safely.

⸻

Knowledge:

* General exercise modifications
* Low-impact alternatives
* Mobility exercises

⸻

Examples:

Shoulder discomfort:

Possible adjustments:

* Reduce range
* Change exercise
* Lower load

⸻

Important:

Never:

* Diagnose
* Claim medical certainty

⸻

Category 6 — Coaching Style Knowledge

Priority:

★★★☆☆

⸻

Purpose:

Teach ATLAS how to communicate.

⸻

Includes:

* Asking good questions
* Explaining reasoning
* Encouraging consistency

⸻

5. Exercise Database Preparation

The exercise database is both:

1. Application data
2. RAG knowledge source

⸻

Each exercise should have:

Required:

Name
Category
Muscles
Equipment
Difficulty
Instructions
Mistakes
Tips
Media

⸻

Optional:

Progressions
Regressions
Alternatives
Related exercises

⸻

6. Knowledge Collection Tasks

Phase 1 — Exercise Foundation

Create:

100-150 core exercises.

Categories:

⸻

Chest:

* Bench press
* Incline press
* Dumbbell press
* Fly variations

⸻

Back:

* Pull ups
* Lat pulldown
* Rows

⸻

Legs:

* Squat
* Deadlift
* Lunges
* Leg press

⸻

Shoulders:

* Presses
* Raises

⸻

Core:

* Planks
* Crunch variations

⸻

Full body:

* Kettlebell
* Olympic movements

⸻

Phase 2 — Equipment Expansion

Add:

Gym

* Machines
* Barbells
* Cables

⸻

Home

* Dumbbells
* Bands
* Bodyweight

⸻

Functional

* Kettlebells
* Rings

⸻

Phase 3 — Sport Knowledge

Add:

Activities:

* Running
* Surfing
* Skateboarding
* Boxing
* Yoga
* Pilates

⸻

Each activity:

Store:

* Training type
* Important metrics
* Recovery needs

⸻

7. Document Format

Each knowledge document should follow:

Title:
Category:
Summary:
Detailed Explanation:
Common Questions:
Examples:
Safety Notes:
Related Topics:

⸻

Example:

Title:
Bench Press Technique
Category:
Exercise
Summary:
Compound pushing movement.
Detailed Explanation:
...
Common Questions:
"Why do I feel shoulders?"
Safety Notes:
...

⸻

8. Embedding Strategy

Each document is converted into embeddings.

Important:

Do not create extremely large chunks.

Recommended:

Small focused chunks.

Example:

Good:

“Bench press shoulder position”

Bad:

“All chest training information”

⸻

9. Retrieval Strategy

When ATLAS receives a question:

Example:

“How can I improve my squat?”

Retrieve:

Exercise:

Squat technique

Training:

Progressive overload

User:

Previous squat performance

⸻

10. User-Specific RAG Context

RAG knowledge is combined with user data.

Example:

Knowledge:

“Increase weight gradually.”

User:

“Currently squatting 80kg.”

ATLAS:

“Based on your previous 80kg squat, try 82.5kg if today’s sets feel controlled.”

⸻

11. MVP RAG Scope

Required:

✓ Exercise knowledge base

✓ Exercise explanations

✓ Workout generation support

✓ Technique answers

✓ Basic recovery knowledge

⸻

Not required:

* Medical database
* Advanced nutrition
* Scientific paper database

⸻

12. Knowledge Creation Workflow

Recommended workflow:

Research
↓
Write structured documents
↓
Validate information
↓
Store in database
↓
Generate embeddings
↓
Test retrieval
↓
Improve

⸻

13. Quality Rules

Knowledge must be:

* Structured
* Consistent
* Practical
* Easy to retrieve

⸻

Avoid:

* Random internet scraping
* Contradictory advice
* Unsupported claims

⸻

End of RAG Knowledge Plan