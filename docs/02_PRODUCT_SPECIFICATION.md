ATLAS — Product Specification Document

Version 1.0

⸻

1. Document Purpose

This document defines the detailed functional requirements of ATLAS.

It describes:

* User flows
* Screen behavior
* Feature requirements
* System logic
* AI behavior
* MVP boundaries
* Acceptance criteria

This document should guide:

* Frontend development
* Backend development
* Database design
* AI implementation
* Testing

⸻

2. Product Architecture Overview

ATLAS consists of five major systems:

2.1 User Experience Layer

Responsible for:

* Interface
* Animations
* User interactions
* Visual experience

Technology:

* React
* TypeScript
* CSS
* Three.js
* GSAP

⸻

2.2 Fitness Management System

Responsible for:

* Exercises
* Workouts
* Tracking
* Progress

⸻

2.3 AI Coaching System

Responsible for:

* Personalized recommendations
* Workout generation
* Conversation
* Adaptation

⸻

2.4 Knowledge System

Responsible for:

* Exercise knowledge
* Training principles
* Recovery information

Implemented using:

* RAG
* Vector search

⸻

2.5 User Memory System

Responsible for remembering:

* Preferences
* Training habits
* Favorite exercises
* Goals
* Feedback

⸻

3. User Journey

⸻

Flow 1 — New User

Landing Page
↓
Register
↓
Onboarding
↓
AI Profile Creation
↓
Dashboard
↓
First Recommended Workouts

⸻

Flow 2 — Returning User

Login
↓
Dashboard
↓
Today's Recommendation
↓
Workout / AI Coach
↓
Progress Update

⸻

4. Screen Specifications

⸻

Screen 1 — Landing Page

Purpose

Introduce ATLAS and create emotional connection.

⸻

Requirements

The landing page must communicate:

* Intelligence
* Premium quality
* Fitness transformation

⸻

Sections

⸻

Hero Section

No background video.

Reason:

The product should create the WOW through:

* 3D
* Motion
* Data visualization

⸻

Content:

Headline:

“Your adaptive AI fitness coach.”

Supporting text:

“Train smarter. Track everything. Improve continuously.”

Actions:

Primary:

Start Journey

Secondary:

Explore Features

⸻

Hero Visual

Possible elements:

* 3D athlete silhouette
* Floating performance cards
* Training metrics
* Animated data

Examples:

Cards:

Strength +12%
Workout Streak 14 days
New Personal Record

⸻

Features Section

Cards:

AI Coach

Description:

Personalized training intelligence.

⸻

Smart Tracking

Description:

Every set, every improvement.

⸻

Multi Sport

Description:

One place for your entire fitness journey.

⸻

Exercise Intelligence

Description:

Learn better movement.

⸻

Acceptance Criteria

Landing page must:

✓ Load quickly
✓ Feel premium
✓ Work on desktop/mobile
✓ Include custom animations
✓ Avoid generic templates

⸻

Screen 2 — Authentication

Purpose

Create emotional entry experience.

⸻

Components:

* Login
* Register

⸻

Design:

Glass card.

Background:

Optional cinematic video.

⸻

Video examples:

* Running
* Weight training
* Surfing
* Recovery moments

⸻

Requirements:

User can:

* Create account
* Login
* Receive JWT token

⸻

Acceptance Criteria:

✓ Password encrypted
✓ JWT generated
✓ Protected routes available

⸻

Screen 3 — User Onboarding

Purpose

Collect enough information to personalize ATLAS.

⸻

Step 1 — Basic Profile

Fields:

Required:

* Name
* Age
* Height
* Weight

Optional:

* Gender

⸻

Step 2 — Goals

Multiple selection.

Options:

* Build muscle
* Lose weight
* Increase strength
* Improve endurance
* Improve health
* Maintain active lifestyle

⸻

Rules:

User can select multiple goals.

⸻

Step 3 — Training Frequency

The system should not force fixed schedules.

Options:

Training range:

Minimum days:

1-7

Maximum days:

1-7

Additional option:

“I don’t have fixed training days”

⸻

Step 4 — Activities

Multiple selection:

* Gym
* Running
* Surf
* Skate
* Boxing
* Yoga
* Pilates
* Calisthenics

* more options you will bring i want a lot of activities all the sport activities

⸻

Step 5 — Exercise Preferences

User can select:

Favorite exercises.

Exercises they want to improve.

Muscle groups they want focus on.

⸻

Step 6 — Injuries and Recovery

Purpose:

Adapt training.

Examples:

* Previous injuries
* Sensitive areas
* Mobility limitations

Important:

ATLAS does not diagnose medical conditions.

⸻

Step 7 — Equipment

Options:

* Full gym
* Home equipment
* Dumbbells
* Bodyweight

⸻

Completion

After onboarding:

Create:

* User profile
* Initial preferences
* AI context

⸻

Screen 4 — Dashboard

Purpose

Main control center.

⸻

Components

⸻

Today’s Recommendation Card

Shows:

* Recommended workout
* Reason

Example:

“Based on your goals and last session.”

⸻

AI Coach Preview

Small conversation entry.

⸻

Progress Cards

Examples:

* Workout streak
* Total workouts
* Current goal
* Latest PR

⸻

Calendar

Displays:

* Gym workouts
* Sports activities
* Recovery days

⸻

Acceptance Criteria

Dashboard must:

✓ Load personalized data
✓ Display latest progress
✓ Provide quick actions

⸻

Screen 5 — AI Coach

Purpose

Create personal trainer experience.

⸻

Important Rule

The user should not feel:

“I am talking to AI.”

The user should feel:

“I have a coach.”

⸻

AI Capabilities

⸻

Workout Creation

Input:

* Goals
* Time available
* Equipment
* Experience
* History

Output:

Personalized workout.

⸻

Workout Adjustment

Example:

User:

“I only have 30 minutes”

ATLAS:

* Reduces volume
* Keeps goal priority
* Adjusts exercises

⸻

Exercise Guidance

Provides:

* Technique
* Breathing
* Common mistakes
* Alternatives

⸻

Progress Analysis

Analyzes:

* Strength
* Consistency
* Training volume

⸻

Screen 6 — Workout Library

Purpose

Provide ready-made programs.

⸻

Categories:

* Push
* Pull
* Legs
* Upper
* Lower
* Full body
* Core
* Mobility
* Calisthenics
* Pilates

⸻

Workout Card Contains:

* Name
* Goal
* Duration
* Difficulty
* Exercise count

⸻

Actions:

* Start
* Edit
* Save

⸻

Screen 7 — Workout Builder

Purpose

Allow custom workout creation.

⸻

Exercise Selection

Filters:

* Muscle
* Equipment
* Difficulty
* Category

⸻

Each Exercise Card:

Contains:

* Name
* GIF/video
* Instructions
* Muscle groups
* Tips

⸻

User Actions:

Add exercise.

Configure:

* Sets
* Reps
* Weight

Reorder exercises.

Save workout.

⸻

Screen 8 — Workout Mode

Purpose

Execute workout.

⸻

Main Components

WorkoutMode
Exercise Display
Set Tracker
Timer
Rest Timer
Finish Button

⸻

Set Tracking

Each set:

Fields:

* Weight
* Reps
* Completed status

⸻

Weight Memory

Logic:

When opening exercise:

System loads previous values.

Example:

Previous:

Set 1:
25kg

Set 2:
25kg

Set 3:
27.5kg

Suggested automatically.

User can edit.

New values saved.

⸻

Personal Records

When:

Current performance exceeds previous record.

Trigger:

Achievement notification.

Example:

“New Personal Record!”

⸻

Screen 9 — Workout Summary

After completion display:

* Duration
* Exercises completed
* Total volume
* Personal records
* Notes
* Rating
* Optional photo

⸻

Screen 10 — Progress

Track:

Body:

* Weight
* Photos

Performance:

* Strength
* PRs
* Volume

Behavior:

* Consistency
* Activity frequency

⸻

Screen 11 — Profile Settings

Includes:

Personal data.

Preferences:

* Units

Examples:

Weight:

kg / lb

Distance:

km / miles

⸻

Training preferences.

Notifications.

⸻

5. AI Agent Functional Requirements

⸻

Personality

ATLAS should be:

* Professional
* Calm
* Knowledgeable
* Supportive

Avoid:

* Fake hype
* Excessive emojis
* Generic motivation

⸻

AI Rules

ATLAS must:

* Consider user history
* Consider injuries
* Consider preferences
* Explain recommendations

⸻

ATLAS must not:

* Diagnose medical issues
* Replace professional healthcare

⸻

6. MVP Feature List

Required:

Authentication

✓ Register
✓ Login
✓ JWT protection

⸻

User System

✓ Profile
✓ Preferences
✓ Onboarding

⸻

Fitness System

✓ Exercise library
✓ Workout builder
✓ Workout execution
✓ Workout history

⸻

AI

✓ Basic AI Coach
✓ RAG exercise knowledge
✓ Workout generation

⸻

Design

✓ Premium UI
✓ Custom CSS
✓ Animations
✓ 3D element

⸻

7. Future Features

Not required for MVP:

* Apple Health
* Smart watches
* Spotify integration
* Nutrition system
* Social
* Real-time computer vision
* Live form correction

⸻

8. Development Rules

All development must follow:

* React + Vite
* TypeScript
* MongoDB
* Express
* Component-based architecture
* CSS per component

Forbidden:

* Tailwind
* Bootstrap
* Generic UI libraries
* Inline styling

⸻

End of Product Specification