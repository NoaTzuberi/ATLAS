ATLAS — AI Agent Specification

Version 1.0

⸻

1. Purpose

This document defines the architecture and behavior of the ATLAS AI coaching system.

The AI system is the core differentiator of ATLAS.

The goal is not to create a chatbot.

The goal is to create an adaptive digital fitness coach that:

* Understands the user
* Learns over time
* Creates personalized training
* Explains decisions
* Adjusts plans
* Provides meaningful recommendations

⸻

2. AI Philosophy

The User Should Feel:

“I have a coach who knows me.”

Not:

“I am chatting with an AI.”

⸻

3. Agent Architecture

ATLAS uses a hierarchical agent architecture.

The system contains:

1. ATLAS Core Coach Agent

The main user-facing agent.

Responsibilities:

* Understand user intent
* Manage conversation
* Decide which specialist capability is needed
* Combine results
* Communicate naturally

⸻

2. Specialized Agents

Specialized agents provide domain expertise.

They should not communicate directly with the user.

⸻

Architecture:

                         USER
                          |
                          |
                  ATLAS CORE AGENT
                          |
        -----------------------------------
        |             |          |          |
 Workout Agent   Exercise   Recovery   Progress
                  Agent      Agent      Agent
                          |
                    Knowledge System
                          |
                         RAG

⸻

4. Core Agent

Name

ATLAS Coach Agent

⸻

Main Responsibilities

The Core Agent:

* Receives user messages
* Understands intent
* Retrieves context
* Calls tools
* Delegates tasks
* Creates final response

⸻

Example:

User:

“I only have 40 minutes and my shoulder hurts. What should I do?”

Core Agent:

1. Gets user profile
2. Calls Recovery Agent
3. Calls Workout Agent
4. Creates adapted workout
5. Explains recommendation

⸻

5. Workout Agent

Purpose

Responsible for workout creation and modification.

⸻

Capabilities:

Create Workout

Inputs:

* Goal
* Experience
* Available time
* Equipment
* History

Output:

Structured workout.

⸻

Modify Workout

Examples:

User:

“Too long”

Adjust:

* Exercise count
* Sets
* Rest times

⸻

User:

“I don’t like this exercise”

Replace:

* Movement
* Muscle target

⸻

Progressive Overload

Analyzes:

* Previous weights
* Reps
* Performance

Suggests:

* Increase weight
* Increase reps
* Maintain load

⸻

6. Exercise Intelligence Agent

Purpose

Expert knowledge about movements.

⸻

Capabilities:

Explain:

* Technique
* Form
* Breathing
* Mistakes
* Alternatives

⸻

Example:

User:

“Why do I feel my shoulder in bench press?”

Agent retrieves:

* Technique information
* Common mistakes
* Alternative exercises

⸻

7. Recovery Agent

Purpose

Help users train sustainably.

⸻

Capabilities:

* Suggest rest
* Recommend mobility
* Modify workouts around limitations

⸻

Important:

The agent does NOT diagnose injuries.

It provides training adjustments.

⸻

Example:

User:

“My knee feels uncomfortable”

Response:

* Ask context questions
* Suggest lower-impact alternatives
* Recommend professional evaluation if needed

⸻

8. Progress Agent

Purpose

Analyze performance.

⸻

Capabilities:

Analyze:

* Strength progression
* Workout consistency
* Volume
* Personal records

⸻

Examples:

“Am I improving?”

Agent analyzes:

Last 30 days:

* Training frequency
* Weight increases
* Performance trends

⸻

9. Nutrition Agent (Future)

Not part of MVP.

Future responsibility:

* Meal suggestions
* Protein guidance
* Habit tracking

Important:

No medical nutrition advice.

⸻

10. Agent Memory System

ATLAS has three memory layers.

⸻

10.1 Profile Memory

Stable information.

Examples:

* Age
* Goals
* Experience
* Preferences

Stored:

Users collection

⸻

10.2 Training Memory

Performance information.

Examples:

* Previous weights
* Favorite exercises
* Workout patterns

Stored:

Workouts + AI Memory

⸻

10.3 Conversation Memory

Context from previous conversations.

Examples:

User:

“I hate long cardio”

Remember:

User preference.

⸻

11. RAG System

Purpose

Provide reliable fitness knowledge.

⸻

Flow:

User Question
↓
ATLAS Agent
↓
Retrieve Relevant Knowledge
↓
Add Context
↓
LLM Generates Response

⸻

12. RAG Knowledge Sources

⸻

Exercise Knowledge

Contains:

* Movement instructions
* Mistakes
* Variations
* Progressions

⸻

Training Knowledge

Contains:

* Strength principles
* Hypertrophy concepts
* Progressive overload
* Recovery

⸻

Coaching Knowledge

Contains:

* Communication style
* Coaching rules
* Decision patterns

⸻

13. Agent Tools

The AI does not directly access the database.

It uses tools.

⸻

Available tools:

getUserProfile()
getWorkoutHistory()
getExerciseDetails()
searchExerciseLibrary()
createWorkout()
modifyWorkout()
saveWorkout()
analyzeProgress()
getPersonalRecords()

⸻

14. Proactive Intelligence

ATLAS should sometimes initiate recommendations.

Examples:

⸻

Missed Training

Trigger:

No workout for several days.

Message:

“I noticed your routine changed this week. Want to adjust your plan?”

⸻

Personal Record

Trigger:

New PR.

Message:

“New personal record. Your strength increased.”

⸻

Plateau Detection

Trigger:

No progression.

Message:

“Your progress has slowed recently. Let’s review your plan.”

⸻

15. Agent Decision Rules

ATLAS must:

* Use user context
* Explain recommendations
* Consider preferences
* Consider limitations
* Ask questions when information is missing

⸻

ATLAS must not:

* Pretend certainty
* Diagnose injuries
* Give dangerous advice
* Override user choices

⸻

16. AI Response Style

Tone:

* Professional
* Encouraging
* Calm
* Human

Avoid:

* Excessive emojis
* Fake excitement
* Generic motivation

⸻

Example:

Bad:

“LET’S GOOO 🔥🔥 YOU GOT THIS BRO”

Good:

“Your consistency improved this month. Increasing your training volume gradually would be a good next step.”

⸻

17. MVP AI Scope

For final project:

Required:

✓ Core Coach Agent

✓ Workout Agent

✓ Exercise Knowledge RAG

✓ User Memory

✓ Workout Generation

✓ Workout Modification

⸻

Future:

* Recovery Agent
* Nutrition Agent
* Advanced analytics
* Wearable integrations

⸻

End of AI Agent Specification