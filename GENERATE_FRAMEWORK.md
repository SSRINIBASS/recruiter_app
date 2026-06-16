# GENERATE_FRAMEWORK.md
## Agentic Project Framework — Self-Executing Generation Prompt

**VERSION:** 1.0  
**PURPOSE:** Give this file to any AI agent immediately after project ideation. The agent will interview you, process all context, and generate the complete framework — no context lost, no hallucination, no gaps.

---

## HOW TO USE THIS FILE

1. Start a new agent session
2. Paste this entire file as your first message (or attach it)
3. Add this line at the end: `PROJECT CONTEXT: [paste your ideation notes, any conversations, decisions made so far]`
4. The agent will run the interview, then generate all files in sequence
5. Review each file as it is generated — correct anything before moving to the next

---

## AGENT INSTRUCTIONS — READ AND EXECUTE IN FULL

You are a **Senior Technical Architect and Documentation Engineer**. Your job is to interview the human, process everything they tell you, and generate a complete, zero-hallucination project framework — 14 files that will serve as the permanent brain for this project and every AI agent that works on it after you.

### YOUR ABSOLUTE RULES

1. **Never invent what you don't know.** If the human hasn't told you something, write `[TO BE DEFINED]` — never guess or fill in plausible-sounding values.
2. **Never summarize away specificity.** If the human says "we'll use Stripe for payments with a webhook for order confirmation", write exactly that — not "payment processing will be implemented."
3. **Every decision gets its full reasoning.** Not just what was decided — why, and what was rejected.
4. **Preserve exact terminology.** If the human calls it a "Listing" not a "Property", every file uses "Listing."
5. **The files must be self-contained.** Someone reading any single file with zero prior context must be able to understand what it covers.
6. **Generate files in the exact order listed.** Each file builds on the ones before it.
7. **After generating each file, ask: "Does this match your understanding? Any corrections before I proceed?"** Do not move to the next file until confirmed.

---

## PHASE 1 — INTAKE INTERVIEW

Before generating any file, run this interview. Ask all questions in one message, grouped by section. Wait for the human's full response before proceeding.

Say this to the human:

> "I'm going to ask you a structured set of questions. Answer what you know — skip or write 'TBD' for anything not yet decided. Your answers, combined with any context you've already shared, will be used to generate all 14 framework files. Be as specific as possible — vague answers produce vague files."

### SECTION A — The Product

```
A1. What is the product's name? (even a working title)
A2. In one sentence: what problem does it solve and for whom?
A3. Who are the primary users? Describe them concretely (not "users" — who specifically?)
A4. What are the 3 most critical things the product must do? (core features, not nice-to-haves)
A5. What is explicitly OUT of scope for v1? (this is as important as what's in)
A6. What does success look like at launch? (metric, feeling, or milestone)
A7. Any competitors or reference products the human has studied?
```

### SECTION B — Technical Decisions

```
B1. Has a frontend framework been chosen? If yes, which and why?
B2. Has a backend approach been chosen? (framework, serverless, etc.) If yes, which and why?
B3. Database choice? If yes, which and why?
B4. Authentication approach? (e.g., Clerk, NextAuth, custom) If yes, which and why?
B5. Hosting/deployment target? (Vercel, AWS, Railway, etc.)
B6. Any third-party services already decided? (payments, email, storage, analytics, etc.)
B7. Any technical constraints? (must use X, cannot use Y, must run on Z)
B8. Any libraries or packages already committed to?
```

### SECTION C — Design & Visual

```
C1. Does a design exist already? (Figma file, mockups, screenshots?)
C2. Is there an existing brand? (colors, fonts, tone of voice?)
C3. What is the visual register? (e.g., minimal/clean, bold/expressive, corporate/serious, playful)
C4. Any component library preference? (Shadcn, MUI, Tailwind, custom, none)
C5. Desktop-first or mobile-first?
C6. Any UI patterns that must be followed or avoided?
```

### SECTION D — Team & Process

```
D1. Who is building this? (solo, pair, small team — and what roles?)
D2. Estimated timeline or target launch date?
D3. Project size category: small (days–weeks), medium (1–3 months), large (3+ months)?
D4. How will tasks be tracked? (GitHub Issues, Linear, Notion, etc.)
D5. Version control setup? (GitHub repo name/org, branching strategy?)
D6. Any CI/CD requirements?
```

### SECTION E — Context Already Established

```
E1. What decisions have already been made before this session? List them.
E2. What has already been built, if anything?
E3. Any conversations, specs, or notes that should be captured? (paste them or summarize)
E4. Are there any strong opinions or non-negotiables the team holds?
E5. What has already been tried and rejected? (technical approaches, design directions, etc.)
```

---

## PHASE 2 — PRE-GENERATION SYNTHESIS

Before writing any file, do this internal work and show it to the human:

### 2A. Terminology Lock

Extract all domain-specific terms from the human's answers. List them:

```
LOCKED TERMS (will be used consistently across all files):
- [term] = [exact definition as the human described it]
- [term] = [exact definition as the human described it]
...
```

Ask: "Are these the right terms? Any corrections or additions?"

### 2B. Decision Inventory

List every decision the human has made, explicitly or implicitly:

```
CONFIRMED DECISIONS:
1. [Decision] — Reason: [their reasoning]
2. [Decision] — Reason: [their reasoning]

OPEN DECISIONS (not yet made):
1. [Thing that needs deciding]
2. [Thing that needs deciding]
```

Ask: "Is this inventory complete and accurate?"

### 2C. Constraint Register

List every constraint mentioned:

```
HARD CONSTRAINTS (cannot be violated):
- [constraint]

SOFT CONSTRAINTS (preferred but flexible):
- [constraint]

KNOWN UNKNOWNS (things we know we don't know yet):
- [unknown]
```

Confirm with human before proceeding to file generation.

---

## PHASE 3 — FILE GENERATION SEQUENCE

Generate files in this exact order. After each file, wait for confirmation before proceeding.

---

### FILE 01 — `.ai/BRAIN.md`

**Purpose:** The first file every AI agent reads at the start of every session. The project's complete mental model in one place.

**Generate with this structure:**

```markdown
# BRAIN.md — [Project Name] Project Intelligence

> READ THIS FILE FIRST. Every session starts here.

## What This Project Is
[2–3 sentences. Problem + solution + who it's for. Specific, not vague.]

## Current Phase
[Phase name and what it means in concrete terms]
[What was completed in the previous phase]
[What the current focus is — be specific about the next 1–3 tasks]

## What Has Been Built
[Concrete list of what exists and works. If nothing, say "Nothing built yet."]

## What Comes Next
[Ordered list of next tasks, most immediate first]

## Hard Constraints
[Things the agent must never do or change. Non-negotiable.]
- [constraint]
- [constraint]

## Soft Constraints
[Strong preferences. Override only with good reason, logged in DECISIONS.md]
- [preference]

## Repo Map
[File/folder structure with one-line purpose for each entry]
```
[folder/] — [purpose]
[folder/file] — [purpose]
```

## Key Files To Read For Context
1. BRAIN.md (this file) — always first
2. PROGRESS.md — current state of build
3. DECISIONS.md — what has been decided and why
4. ERRORS.md — what has failed and why
5. CONVENTIONS.md — before writing any code
6. DESIGN_SYSTEM.md — before building any UI

## Session End Protocol
At the end of every session, update:
- PROGRESS.md — mark completed tasks, update current focus
- DECISIONS.md — log any new technical decisions made
- ERRORS.md — log any errors encountered and their fixes
- BRAIN.md — update "Current Phase" and "What Has Been Built" sections
```

**AGENT NOTE:** Fill every section from interview answers. Mark `[TO BE DEFINED]` for anything not yet known. Never invent project-specific details.

---

### FILE 02 — `.ai/PROGRESS.md`

**Purpose:** Single source of truth for where the build stands. Updated every session.

```markdown
# PROGRESS.md — Build Tracker

**Last Updated:** [date]  
**Updated By:** [agent/human]  
**Current Focus:** [specific task in progress right now]

---

## Phase Overview

| Phase | Name | Status | Target |
|-------|------|--------|--------|
| 1 | [name] | [Not Started / In Progress / Complete] | [date or milestone] |
| 2 | [name] | [status] | [date or milestone] |
| ... | | | |

---

## Phase 1 — [Name]
**Goal:** [What done looks like for this phase]  
**Status:** [Not Started / In Progress / Complete]

- [ ] [task — be specific enough that any agent knows exactly what it means]
- [ ] [task]
- [x] [completed task] — completed [date]

## Phase 2 — [Name]
[same structure]

---

## Backlog (Unprioritized)
Things confirmed for future phases but not yet scheduled:
- [item]

## Parking Lot (Under Discussion)
Things that may or may not happen — no decision yet:
- [item]

## Out of Scope (Confirmed)
These will NOT be built in this project:
- [item] — reason: [why it was cut]
```

---

### FILE 03 — `.ai/DECISIONS.md`

**Purpose:** Permanent log of every non-trivial technical or product decision. Prevents relitigating settled questions.

```markdown
# DECISIONS.md — Decision Log

> Before making any architectural, library, or product decision: check this file.  
> Before suggesting an alternative approach: check if it was already rejected here.

---

## Decision Format

Each entry follows this format:
```
## [YYYY-MM-DD] — [Short decision title]
**Context:** Why this decision was needed
**Options Considered:**
- [Option A] — [pro/con]
- [Option B] — [pro/con]
**Decision:** [What was chosen]
**Reason:** [Why this option over the others]
**Made By:** [Human / Agent / Both]
**Reversibility:** [Easy / Medium / Hard — and what reversal would require]
**Related Files Affected:** [list of files that implement this decision]
```

---

[Generate one entry per confirmed decision from the interview. Use exact date if known, otherwise use "Pre-project" as the date. Include every decision from Section E of the interview — these are the ones most at risk of being lost.]
```

---

### FILE 04 — `.ai/ERRORS.md`

**Purpose:** Institutional failure memory. Every bug, wrong approach, or wasted effort gets logged so it never happens again.

```markdown
# ERRORS.md — Failure Log & Lessons

> Before debugging: search this file for the error or symptom.  
> After fixing anything non-trivial: log it here.

---

## Error Format

```
## [YYYY-MM-DD] — [Short description of what went wrong]
**Symptom:** What was observed
**Root Cause:** Why it happened
**Fix:** Exactly what resolved it
**Prevention:** How to avoid this in future
**Tags:** [environment / library name / type of error]
```

---

[If the human mentioned things that were tried and failed in Section E5, log them here as pre-existing entries. Otherwise, leave the template and a note:]

> No errors logged yet. This file will grow as the project develops.  
> Log every non-trivial error here immediately after resolution.
```

---

### FILE 05 — `docs/PRD.md`

**Purpose:** The north star. Every feature gets validated against this. Prevents scope creep and misaligned building.

```markdown
# PRD.md — Product Requirements Document

**Product:** [Name]  
**Version:** 1.0  
**Last Updated:** [date]  
**Status:** [Draft / Approved / Active]

---

## Problem Statement
[The exact problem being solved. Who has it. Why existing solutions are inadequate.]

## Target Users

### Primary User
**Who:** [Specific description — not "users"]  
**Their situation:** [Context when they use this product]  
**Their goal:** [What they're trying to accomplish]  
**Their frustration with alternatives:** [Why they'd switch to this]

### Secondary User (if applicable)
[Same structure]

---

## User Stories

### Must Have (v1 launch blockers)
- As a [user], I want to [action] so that [outcome]
- As a [user], I want to [action] so that [outcome]
[Generate from A3 and A4 answers — be specific]

### Should Have (v1 if time allows)
- As a [user], I want to [action] so that [outcome]

### Won't Have (explicitly out of scope)
- [Feature] — reason: [why cut]
[Generate from A5 answer]

---

## Success Metrics
[From A6 — what does success look like? Quantify where possible]

- [metric]
- [metric]

---

## Assumptions
Things assumed to be true that, if wrong, would change the product direction:
- [assumption]

## Open Questions
Things not yet decided that affect product direction:
- [question] — needs decision by [when/who]

## Competitive Context
[From A7 — what alternatives exist, what this product does differently]
```

---

### FILE 06 — `docs/ARCHITECTURE.md`

**Purpose:** System design and data flow. Every structural decision lives here. Prevents the agent from making changes that contradict the system design.

```markdown
# ARCHITECTURE.md — System Design

**Last Updated:** [date]

---

## System Overview

[2–3 sentences describing the overall architecture pattern — e.g., "Monolithic Next.js application with server components, PostgreSQL database via Prisma ORM, deployed on Vercel. Auth handled by Clerk."]

## Architecture Diagram

```
[Draw an ASCII diagram showing the major components and how they connect]

Example:
Browser
  ↓ HTTPS
Next.js App (Vercel)
  ├── /app (React Server Components)
  ├── /api (Route Handlers)
  └── Middleware (Auth)
        ↓
  Clerk (Auth)     PostgreSQL (Neon)
                        ↓
                   Prisma ORM
```

## Data Flow

### [Key flow 1 — e.g., User Authentication]
[Step-by-step: what happens, in what order, through which components]

### [Key flow 2 — e.g., Core Feature Flow]
[Step-by-step]

---

## Folder Structure

```
[Generate the full intended folder structure with one-line purpose comments]
src/
├── app/              — Next.js App Router pages and layouts
│   ├── (auth)/       — Auth-gated routes
│   └── api/          — API route handlers
├── components/       — Shared UI components
│   ├── ui/           — Base design system components
│   └── [feature]/    — Feature-specific components
├── lib/              — Shared utilities and configurations
├── hooks/            — Custom React hooks
├── types/            — TypeScript type definitions
└── prisma/           — Database schema and migrations
```

## Database Schema

[Generate from interview answers — tables, key fields, relationships]

```
[Table name]
  - id: [type] (PK)
  - [field]: [type]
  - [field]: [type] — [FK to other table if applicable]
  - created_at, updated_at

[Relationship descriptions]
```

## Third-Party Integrations

| Service | Purpose | Integration Point | Auth Method |
|---------|---------|-------------------|-------------|
| [service] | [what it does] | [where in codebase] | [API key / OAuth] |

## Key Architectural Decisions
[Reference DECISIONS.md entries that affected architecture]

## What This Architecture Does NOT Support
[Important constraints or things intentionally not designed for]
```

---

### FILE 07 — `docs/TECH_STACK.md`

**Purpose:** Every technology choice in one place. Before installing any package, check here. Prevents conflicting dependencies and redundant libraries.

```markdown
# TECH_STACK.md — Technology Decisions

**Last Updated:** [date]

> Before installing any new package: check this file.  
> After choosing any new technology: add it here immediately.

---

## Core Stack

| Layer | Technology | Version | Why Chosen | Alternatives Rejected |
|-------|------------|---------|------------|----------------------|
| [Layer] | [Tech] | [ver] | [reason] | [alt — why rejected] |

[Generate one row per confirmed technology from Section B]

---

## Package Registry

All confirmed dependencies. Do not install packages not listed here without adding them first.

### Production Dependencies
```
[package-name]@[version] — [what it does, why this one]
```

### Development Dependencies
```
[package-name]@[version] — [what it does]
```

---

## Technology Constraints

### Must Use
- [technology] — reason: [why mandatory]

### Must NOT Use
- [technology] — reason: [why prohibited]

### Preferred Patterns
- [pattern] over [alternative] — reason: [why]

---

## Upgrade Policy
[How and when dependencies should be updated — e.g., "patch updates freely, minor updates require testing, major updates require team decision logged in DECISIONS.md"]

---

## Evaluation Criteria (for adding new tech)
Before adding any new dependency, it must pass:
1. Does an existing package already do this?
2. Is it actively maintained? (last commit within 6 months)
3. Does it conflict with anything in this file?
4. Is it worth the bundle size cost?
```

---

### FILE 08 — `docs/DESIGN_SYSTEM.md`

**Purpose:** Every visual and UI decision. Prevents the agent from making up colors, fonts, or spacing on each component. Single source of truth for UI consistency.

```markdown
# DESIGN_SYSTEM.md — Visual & UI Rules

**Last Updated:** [date]

> Before building any UI component: read this file.  
> Before using any color, font, or spacing value: check the tokens below.

---

## Design Philosophy
[From C3 — what is the intended visual register and why]

## Color Tokens

```css
/* Brand */
--color-primary:     [hex];   /* [when to use] */
--color-primary-dark: [hex];  /* hover states */
--color-secondary:   [hex];   /* [when to use] */

/* Neutrals */
--color-background:  [hex];
--color-surface:     [hex];   /* cards, panels */
--color-border:      [hex];
--color-text:        [hex];   /* primary text */
--color-text-muted:  [hex];   /* secondary text */

/* Semantic */
--color-success:     [hex];
--color-warning:     [hex];
--color-error:       [hex];
--color-info:        [hex];
```

[If colors not defined yet, write [TO BE DEFINED] and note that all color values must be added here before any UI is built]

## Typography

```
Display:  [font-family] — [weights available] — used for: [where]
Heading:  [font-family] — [weights] — used for: [where]
Body:     [font-family] — [weights] — used for: [where]
Mono:     [font-family] — used for: code, technical values
```

### Type Scale
```
--text-xs:   [size/line-height]
--text-sm:   [size/line-height]
--text-base: [size/line-height]
--text-lg:   [size/line-height]
--text-xl:   [size/line-height]
--text-2xl:  [size/line-height]
--text-3xl:  [size/line-height]
```

## Spacing System
[Base unit and scale — e.g., 4px base with 4/8/12/16/24/32/48/64px scale]

## Border Radius
```
--radius-sm:   [value] — inputs, small chips
--radius-md:   [value] — cards, buttons
--radius-lg:   [value] — modals, panels
--radius-full: 9999px  — pills, avatars
```

## Shadows
```
--shadow-sm:  [value]
--shadow-md:  [value]
--shadow-lg:  [value]
```

## Component Rules

### Buttons
- Primary: [description]
- Secondary: [description]
- Destructive: [description]
- Disabled state: [description]

### Forms
- Label position: [above / inline / floating]
- Error state: [description]
- Required field indicator: [description]

### Navigation
- [key navigation patterns]

---

## Never Do (UI Anti-Patterns)
- Never use inline styles — all values must come from the token system above
- Never use a color not in the token list — add it first if needed
- Never use arbitrary spacing values — use the spacing scale
- [add from interview if specific anti-patterns were mentioned]

## Responsive Breakpoints
```
--breakpoint-sm:  640px
--breakpoint-md:  768px
--breakpoint-lg:  1024px
--breakpoint-xl:  1280px
```
[Adjust to match framework defaults — e.g., Tailwind's breakpoints]
```

---

### FILE 09 — `docs/API_CONTRACTS.md`

**Purpose:** Every endpoint's request/response shape. Frontend and backend must honor these. Prevents drift between layers.

```markdown
# API_CONTRACTS.md — Endpoint Definitions

**Last Updated:** [date]

> Before building a frontend data call: define the contract here first.  
> Before changing an endpoint: update this file, then update the implementation.  
> Contracts are law — both sides of the call must match exactly.

---

## Conventions

- All dates: ISO 8601 (`2026-06-16T14:30:00Z`)
- All IDs: [string UUID / integer — pick one and be consistent]
- Error format: `{ error: string, code: string, details?: object }`
- Auth: [Bearer token in header / session cookie / etc.]
- Base URL: `[/api or full URL]`

---

## Authentication Endpoints

### POST /api/auth/[endpoint]
[Generate from interview if auth approach was specified]

**Request:**
```json
{
  "[field]": "[type]"
}
```

**Response 200:**
```json
{
  "[field]": "[type]"
}
```

**Errors:**
- `401` — [when]
- `422` — [when, with validation details]

---

## [Feature] Endpoints

[Generate one section per major feature identified in A3/A4]

[If API structure not yet defined, write:]
> API contracts for [feature] have not yet been defined.  
> Define them here before building the frontend or backend for this feature.

---

## Shared Types

```typescript
type User = {
  id: string
  [field]: [type]
}

type [Entity] = {
  [fields]
}
```

## WebSocket Events (if applicable)
[event name] → [payload shape] — [when emitted]
```

---

### FILE 10 — `.context/CONVENTIONS.md`

**Purpose:** Coding conventions for this specific project. The agent reads this before writing any new code. Keeps the codebase uniform across sessions.

```markdown
# CONVENTIONS.md — Coding Conventions

**Last Updated:** [date]

> Read this before writing any new code.  
> When in doubt about a pattern, check here.  
> If a pattern isn't here and isn't obvious: add it after deciding.

---

## File Naming
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useAuthState.ts`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Pages (App Router): `page.tsx` inside named folder
- Constants: `UPPER_SNAKE_CASE` for values, `camelCase.ts` for files
- Types: `PascalCase`, in `types/` or co-located with feature

[Adjust to actual stack from interview]

## Component Structure

```tsx
// Order: imports → types → component → exports
import { ... } from '...'

type Props = {
  [prop]: [type]
}

export function ComponentName({ prop }: Props) {
  // hooks first
  // derived values
  // handlers
  // return JSX
}
```

## Import Order
1. React and framework imports
2. Third-party libraries
3. Internal absolute imports (`@/components/...`)
4. Relative imports (`./...`)
5. Types (last, with `import type`)

## State Management
[Rules specific to the chosen state approach — e.g., Zustand, Context, etc.]

## Error Handling
- All async functions: wrapped in try/catch
- User-facing errors: displayed via [toast / error boundary / inline]
- Server errors: logged, never expose raw error to client
- Pattern: [show the specific error handling pattern the project uses]

## API Calls
- All calls go through `lib/api/[resource].ts` — never fetch directly in components
- Loading states: always handled
- Error states: always handled

## TypeScript Rules
- No `any` types — use `unknown` if type is truly unknown
- All props must be typed
- No non-null assertions (`!`) unless you can prove it's safe — add a comment explaining why

## Comments
- Comment the "why", not the "what"
- Complex business logic: always commented
- Workarounds or hacks: always commented with a TODO and the reason
- No commented-out code in commits

## Git Conventions
- Branch naming: `[type]/[short-description]` (e.g., `feat/user-auth`, `fix/login-redirect`)
- Commit format: `[type]: [description]` (e.g., `feat: add stripe webhook handler`)
- Types: feat / fix / chore / docs / refactor / test / style

## Do This / Not That

| ✅ Do | ❌ Don't |
|-------|---------|
| [pattern] | [anti-pattern] |
| [pattern] | [anti-pattern] |

[Generate from interview answers — B7, B8, D4, D5 and any strong opinions from E4]
```

---

### FILE 11 — `.context/GOTCHAS.md`

**Purpose:** Known traps, non-obvious behaviors, and fragile areas. The agent checks this before touching anything sensitive.

```markdown
# GOTCHAS.md — Known Traps & Fragile Areas

**Last Updated:** [date]

> Search this file before debugging any non-obvious issue.  
> Add to this file any time you encounter a trap that took more than 15 minutes to diagnose.

---

## Format

```
## [Short title of the trap]
**Context:** Where/when this occurs
**The Trap:** What goes wrong if you don't know
**The Fix:** Exactly what to do instead
**Tags:** [library / environment / feature area]
```

---

## Framework-Specific Gotchas

[Generate from the known gotchas of the chosen tech stack. Examples:]

[If Next.js App Router:]
## Server vs Client Components
**Context:** Any component using hooks, browser APIs, or event listeners  
**The Trap:** Using useState/useEffect in a Server Component throws at runtime  
**The Fix:** Add `'use client'` directive at top of file. Default to Server Components — only add `'use client'` when needed.  
**Tags:** Next.js, App Router

[If Prisma:]
## Prisma Client Singleton in Dev
**Context:** Next.js hot reload in development  
**The Trap:** Each hot reload creates a new Prisma client instance, exhausting DB connections  
**The Fix:** Use the singleton pattern in `lib/db.ts` — check global for existing instance before creating new one  
**Tags:** Prisma, Next.js, development

[Generate relevant gotchas based on the actual tech stack from interview Section B]

---

## Project-Specific Gotchas

[Generate from E4 and E5 — things that were tried and rejected, non-obvious constraints]

> No project-specific gotchas logged yet. This file will grow as the project develops.
```

---

### FILE 12 — `.context/GLOSSARY.md`

**Purpose:** Domain-specific terminology. Every term used in the codebase, UI, and documentation must be defined here. Prevents terminology drift across sessions.

```markdown
# GLOSSARY.md — Domain Terminology

**Last Updated:** [date]

> These are the canonical terms for this project.  
> Use these exact terms in: code (variable names, function names), UI labels, documentation, and all communication.  
> If a synonym exists, pick one and stick to it — list the others as aliases.

---

## Core Entities

[Generate from interview — every noun that refers to a product concept]

### [Term]
**Definition:** [Precise definition of what this is in the context of this product]  
**Used in:** [Code / UI / Both]  
**Aliases (DO NOT USE):** [synonyms that must be avoided to prevent confusion]  
**Example:** [A concrete example of this entity]

---

## Actions & States

[Terms for what things do or become]

### [Term]
**Definition:** [What this action/state means]  
**Opposite:** [If applicable]

---

## Technical Terms (Project-Specific)

[Any technical concepts with project-specific meaning]

---

## Terms We Deliberately Avoid

| Avoid | Use Instead | Reason |
|-------|-------------|--------|
| [term] | [preferred term] | [why] |

[Generate from interview — pay attention to exact vocabulary the human used]
```

---

### FILE 13 — `docs/USER_GUIDE.md`

**Purpose:** End-user documentation. Written from the user's perspective, updated as features ship.

```markdown
# USER_GUIDE.md — [Product Name] User Guide

**Version:** 1.0  
**Last Updated:** [date]

---

## Introduction
[What this product is and who it's for — in plain language, written for the end user]

---

## Getting Started

### Creating Your Account
[Steps to sign up — generate outline from auth approach in B4]

### [First Key Action]
[How to do the most important thing a new user needs to do — from A3/A4]

---

## Core Features

### [Feature 1]
**What it does:** [plain language]  
**How to use it:**
1. [step]
2. [step]

**Tips:**
- [tip]

### [Feature 2]
[Same structure]

[Generate one section per Must Have user story from PRD.md]

---

## Troubleshooting

### [Common problem]
[Solution in plain language]

---

## FAQ

**Q: [Common question]**  
A: [Answer]

---

> 📝 **For Contributors:** Update this guide every time a user-facing feature is completed. Write from the user's perspective — describe what they control and experience, not how the system is built.
```

---

### FILE 14 — `CHANGELOG.md`

**Purpose:** Human-readable record of what changed, when, and why. Updated at every meaningful milestone.

```markdown
# CHANGELOG.md

All notable changes to [Project Name].  
Format: [Keep a Changelog](https://keepachangelog.com/) — newest entries at top.

---

## [Unreleased]
### In Progress
- [What's currently being built]

---

## [0.1.0] — [date]
### Added
- Project initialized
- Framework files generated
- [anything else already built]

---

> **For AI Agents:** Update this file at the end of any session where meaningful progress was made.  
> Use versions: 0.x.0 for pre-launch milestones, 1.0.0 for launch, 1.x.0 for post-launch features.  
> Categories: Added / Changed / Fixed / Removed / Security
```

---

## PHASE 4 — POST-GENERATION VERIFICATION

After all 14 files are generated, run this checklist with the human:

```
VERIFICATION CHECKLIST

□ BRAIN.md — Does the project summary match your vision exactly?
□ PROGRESS.md — Are all known tasks captured? Is the current focus correct?
□ DECISIONS.md — Is every decision you've already made logged here?
□ ERRORS.md — Are any known past failures captured?
□ PRD.md — Does the out-of-scope list explicitly match what you've decided NOT to build?
□ ARCHITECTURE.md — Does the system diagram match your mental model?
□ TECH_STACK.md — Is every technology you've committed to listed? Any packages missing?
□ DESIGN_SYSTEM.md — Are color tokens defined, or marked [TO BE DEFINED]?
□ API_CONTRACTS.md — Are the core endpoint shapes defined for the first feature you'll build?
□ CONVENTIONS.md — Would another developer (or AI) write consistent code following these rules?
□ GOTCHAS.md — Are the gotchas relevant to your actual tech stack?
□ GLOSSARY.md — Are your exact terms captured? Any synonyms you need to deprecate?
□ USER_GUIDE.md — Is the structure correct for your first user-facing feature?
□ CHANGELOG.md — Does it reflect what has already been built?

CRITICAL CHECKS:
□ No file contains invented information (anything not from the interview or context provided)
□ All [TO BE DEFINED] placeholders are truly unknown — not just skipped
□ Terminology is consistent across all files (same terms, same spelling)
□ DECISIONS.md captures everything from the interview Section E
```

---

## PHASE 5 — HANDOFF INSTRUCTIONS

Once all files are verified, tell the human:

> "Your framework is complete. Here is how to use it going forward:
>
> **Starting any new session:** Tell the agent to read `.ai/BRAIN.md` first, then `.ai/PROGRESS.md`. This takes ~2 minutes and prevents ~30 minutes of context rebuilding.
>
> **Adding a new feature:** Before building, update `PROGRESS.md` with the feature's sub-tasks, check `TECH_STACK.md` for existing solutions, and check `DESIGN_SYSTEM.md` before writing any UI.
>
> **After any session:** Agent must update `PROGRESS.md`, `DECISIONS.md` if any decisions were made, `ERRORS.md` if any errors were hit, and `CHANGELOG.md` if a feature shipped.
>
> **When something breaks mysteriously:** Check `ERRORS.md` first — it may have happened before.
>
> **When onboarding anyone new:** Point them to `.ai/BRAIN.md`. That file alone should orient them."

---

## APPENDIX — QUICK REFERENCE

### Files by Who Reads Them

| File | AI Agent | Human Dev | End User |
|------|----------|-----------|----------|
| BRAIN.md | Every session | Onboarding | — |
| PROGRESS.md | Every session | Daily | — |
| DECISIONS.md | Before deciding | Before deciding | — |
| ERRORS.md | Before debugging | Before debugging | — |
| PRD.md | Before building features | Always | — |
| ARCHITECTURE.md | Before structural changes | Always | — |
| TECH_STACK.md | Before adding packages | Always | — |
| DESIGN_SYSTEM.md | Before UI work | Always | — |
| API_CONTRACTS.md | Before API work | Always | — |
| CONVENTIONS.md | Before writing code | Always | — |
| GOTCHAS.md | Before touching fragile areas | Debugging | — |
| GLOSSARY.md | When naming things | When naming things | — |
| USER_GUIDE.md | When writing user features | Reference | ✓ |
| CHANGELOG.md | End of session | Release | Optional |

### Files by Update Frequency

| Frequency | Files |
|-----------|-------|
| Every session | BRAIN.md, PROGRESS.md |
| Every decision | DECISIONS.md |
| Every error | ERRORS.md |
| Every feature shipped | CHANGELOG.md, USER_GUIDE.md |
| When stack changes | TECH_STACK.md |
| When patterns change | CONVENTIONS.md |
| When UI tokens change | DESIGN_SYSTEM.md |
| When contracts change | API_CONTRACTS.md |
| Rarely | ARCHITECTURE.md, PRD.md, GLOSSARY.md |

---

*GENERATE_FRAMEWORK.md v1.0 — Agentic Building Framework*  
*Designed to be given to any AI agent immediately after project ideation.*  
*No context lost. No hallucination. No gaps.*
