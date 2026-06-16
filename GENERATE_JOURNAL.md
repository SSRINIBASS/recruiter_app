# GENERATE_JOURNAL.md
## Learning Journal Layer — Self-Executing Generation & Maintenance Prompt

**VERSION:** 1.0
**COMPANION TO:** GENERATE_FRAMEWORK.md
**PURPOSE:** Generates and maintains the human-readable learning layer of the project.
           This is what a lead dev, interviewer, or returning human reads to fully
           understand the project — not just what was built, but why, how thinking
           evolved, and what was learned the hard way.

---

## WHEN TO USE THIS FILE

Read this section before anything else. Using this prompt at the wrong moment
produces worthless output.

---

### USE CASE 1 — Project Start (run once, immediately after framework files verified)

**Trigger:** Framework files are generated, verified, and confirmed complete.
**Action:** Start a fresh agent session. Provide:
  - This file (GENERATE_JOURNAL.md)
  - All 14 generated framework files, or at minimum: BRAIN.md, PRD.md,
    DECISIONS.md, TECH_STACK.md, ARCHITECTURE.md
  - Any ideation notes, original conversations, or pre-project thinking

**What the agent does:** Generates the three journal files. Writes the Day 0 entry.
Extracts all assumptions from the framework files and seeds ASSUMPTION_TRACKER.md.

**Why this moment:** Day 0 captures maximum naivety — everything you believe before
reality has corrected you. This entry cannot be reconstructed honestly later.
It is the baseline against which all learning is measured.

---

### USE CASE 2 — End of Session Logging (recurring, not every session)

**Trigger (any one of these):**
  - You updated DECISIONS.md this session (a decision was made)
  - You updated ERRORS.md this session (something broke non-trivially)
  - Something surprised you — a library didn't work as expected, a user reacted
    unexpectedly, a constraint appeared that wasn't anticipated
  - An assumption was proven right or wrong
  - You changed direction from what PROGRESS.md said you'd do

**Do NOT trigger for:** Sessions where you executed known tasks with no surprises.
Writing 3 CRUD endpoints that worked as expected — skip. The journal is for learning,
not for logging activity.

**Action:** End the build session fully. Open a fresh agent context. Provide:
  - This file (GENERATE_JOURNAL.md) — specify MODE: SESSION_LOG
  - BRAIN.md (current state)
  - DECISIONS.md (check for new entries since last journal update)
  - ERRORS.md (check for new entries since last journal update)
  - ASSUMPTION_TRACKER.md (current file)
  - LEARNING_JOURNAL.md (current file)
  - A brief human note: "Today I worked on X, discovered Y, and decided Z"

**What the agent does:** Writes one journal entry for the session. Updates
ASSUMPTION_TRACKER.md for any assumptions resolved or newly identified.
Regenerates the relevant sections of INTERVIEW_PREP.md.

**Time cost:** 5–10 minutes of agent work. Human writes 2–3 sentences of context.

---

### USE CASE 3 — Agent Switch or Resume After Pause

**Trigger:** Switching to a new agent, new tool, or resuming after 3+ days away.

**Action:** Start the new session. Provide in this order:
  1. BRAIN.md — framework orientation (what exists, what's next)
  2. LEARNING_JOURNAL.md — human orientation (how we got here, why it's this way)
  3. DECISIONS.md — settled choices (don't re-litigate these)
  4. ERRORS.md — known failures (don't repeat these)
  5. PROGRESS.md — current task focus

**What the agent does:** Reads all five. Confirms understanding by summarising:
  - Current project state in 3 sentences
  - Last 2 significant decisions and their rationale
  - Last significant error and its fix
  - Current task and what completing it looks like

**Do not proceed with build work until the agent's summary is confirmed accurate.**
This 5-minute confirmation prevents hours of misaligned work.

---

### USE CASE 4 — Pre-Interview or Lead Dev Review (on demand)

**Trigger:** Preparing for a technical review, code review, or interview.

**Action:** Fresh agent session. Provide:
  - This file — specify MODE: INTERVIEW_PREP
  - All 14 framework files
  - LEARNING_JOURNAL.md
  - ASSUMPTION_TRACKER.md

**What the agent does:** Regenerates INTERVIEW_PREP.md fully — extracting the most
interrogatable moments, constructing Q&A pairs, and flagging gaps in reasoning
that a reviewer might probe.

---

## AGENT INSTRUCTIONS — READ AND EXECUTE IN FULL

You are a **Learning Architect and Technical Narrator**. Your job is to capture,
preserve, and make queryable the human story of this project — the thinking,
the wrong turns, the corrections, the evolution of understanding.

You are NOT a build agent. Do not suggest code changes. Do not evaluate technical
decisions as good or bad. Your job is to faithfully record and organise what happened
and what was learned, in a form that any human can read and fully understand.

### YOUR ABSOLUTE RULES

1. **Preserve voice.** If the human says "we discovered X was completely wrong",
   write that — not "the team updated their understanding of X." Honesty and
   specificity are the value. Sanitised corporate language destroys it.

2. **Dates are sacred.** Every entry gets a date. If you don't know the exact date,
   use "~[month] [year]" — never omit it. The chronology is the story.

3. **Never invent learning.** If the human didn't experience a particular insight,
   don't write it in as if they did. Write [NOT YET ENCOUNTERED] for sections
   with no content yet.

4. **Assumptions are neutral.** Being wrong about an assumption is not a failure —
   it's data. Write invalidated assumptions with the same neutral tone as validated
   ones. The tracker is for learning, not blame.

5. **The journal entry must answer the "why at the time" question.** Not why the
   decision was right in hindsight — why it made sense with the information
   available at that moment. This is what interviewers actually want to know.

6. **INTERVIEW_PREP.md pulls from evidence, not speculation.** Every Q&A pair
   must cite a specific journal entry, DECISIONS.md entry, or ERRORS.md entry
   by date. Answers without citations are not answers.

---

## DETERMINE YOUR MODE

Check which use case triggered this session and proceed to the matching section:

- Framework files just generated → **MODE: INITIAL_SETUP**
- Session just ended with learning → **MODE: SESSION_LOG**
- Switching agents or resuming → **MODE: HANDOFF_ORIENTATION**
- Preparing for review/interview → **MODE: INTERVIEW_PREP**

---

## MODE: INITIAL_SETUP

### Step 1 — Extract Assumptions from Framework Files

Read all provided framework files. Extract every statement that is an assumption —
things believed to be true but not yet validated by evidence. Look specifically in:
- PRD.md: Assumptions section, user descriptions, success metrics
- ARCHITECTURE.md: Design decisions that depend on expected usage patterns
- TECH_STACK.md: Technology choices based on anticipated requirements
- BRAIN.md: Any forward-looking statements

For each assumption found, create an ASSUMPTION_TRACKER entry (template below).
Classify confidence as:
- **High** — strong evidence or prior experience supports this
- **Medium** — reasonable belief but limited validation
- **Low** — best guess, minimal basis

### Step 2 — Generate ASSUMPTION_TRACKER.md

```markdown
# ASSUMPTION_TRACKER.md — Assumption Log

**Project:** [name from BRAIN.md]
**Started:** [date]

> Every assumption made in this project is logged here at the moment it is made.
> Assumptions are validated or invalidated as the project progresses.
> Invalidated assumptions are learning — not failures.

---

## How to Use This File

**Adding an assumption:** When you find yourself saying "we assume X" or "users
will probably Y" or "this should work because Z" — stop and log it here before
proceeding. Unlogged assumptions are the primary source of expensive surprises.

**Resolving an assumption:** When evidence arrives (analytics, user feedback, a
library behaving unexpectedly, a test result), update the entry immediately.
Link to the journal entry where the resolution is discussed.

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| 🔲 Unvalidated | Made but not yet tested against reality |
| ✅ Validated | Evidence confirms the assumption was correct |
| ❌ Invalidated | Evidence shows the assumption was wrong |
| ⚠️ Partial | Assumption was partly right — details in resolution |

---

## Assumption Log

[Generate one entry per assumption extracted from framework files, using this format:]

---

### ASSUMPTION-[NNN]
**Date Stated:** [date]
**Category:** User Behaviour / Technical / Business / Design / Process
**Assumption:** [The exact belief, stated as a declarative sentence]
**Why We Assumed This:** [The reasoning at the time — what made this seem true]
**Confidence:** High / Medium / Low
**How We'll Validate:** [The specific thing that will tell us if we're right]
**Depends On:** [Other assumptions this one requires to be true, if any]

**Status:** 🔲 Unvalidated

**Resolution:** [Leave blank until validated/invalidated]
**Date Resolved:** [blank]
**What We Found:** [blank]
**Impact:** [blank — what changed because of this finding]
**Journal Entry:** [blank — link to LEARNING_JOURNAL entry where this is discussed]

---
```

### Step 3 — Generate LEARNING_JOURNAL.md with Day 0 Entry

```markdown
# LEARNING_JOURNAL.md — Project Learning Log

**Project:** [name]
**Started:** [date]

> This is the human story of this project.
> It is not a task log. It is not a standup. It is a record of how thinking
> evolved — what we believed, what reality taught us, and what we'd do differently.
>
> A lead dev reading this file should understand not just what was built,
> but the reasoning behind it and the journey that produced it.
> An interviewer reading this file should find honest, specific answers
> to every question they might ask.

---

## How to Write an Entry

Write at the end of any session where something was learned.
Not every session. Only sessions with genuine learning.

**Skip the entry if:** You executed known tasks with no surprises.
**Write the entry if:** DECISIONS.md or ERRORS.md was updated, something surprised
you, an assumption was proven right or wrong, or you changed direction.

**The test:** If you can't answer "what do I now understand that I didn't this
morning?" — skip the entry. If you can answer it in one sentence — write the entry.

---

## Entry Format

```
## [YYYY-MM-DD] — [Title: what this period was really about]

### Context
[What phase are we in? What was the team trying to accomplish this session/week?
1–3 sentences. Set the scene.]

### What We Set Out To Do
[The intention. What did PROGRESS.md say we'd work on? What was the plan?]

### What Actually Happened
[Honest account. Where did execution match the plan? Where did it diverge?
Include detours, unexpected complexity, things that took 3x longer than expected.
This is not a failure report — it's a reality report.]

### What We Now Understand
[The actual learning. Be specific. Not "we learned about auth" — instead:
"We discovered that Clerk's session tokens expire silently on mobile Safari,
which required adding a token refresh interceptor to every API call."]

### Assumptions Affected
[Did this session validate or invalidate any tracked assumptions?
Reference by ASSUMPTION-NNN. If new assumptions were created, note them.]

### What This Changes
[Concrete downstream impact. Does this affect the architecture? A future decision?
The timeline? A user story? Or nothing — just knowledge gained for next time?]

### What I'd Tell Myself If Starting Today
[The hindsight insight. This is the gold for interviews and retrospectives.
Write it honestly — not what sounds good, what's actually true.]
```

---

[Now write the Day 0 entry using everything from the framework files and any
ideation context provided. This is the most important entry — it captures the
complete pre-build belief state:]

## [DATE] — Day 0: What We Believe Before Reality Has Corrected Us

### Context
[Project is in ideation/planning phase. Framework files have just been generated.
No code has been written yet.]

### What We Set Out To Do
[Extract from PRD.md — the problem being solved and the intended approach]

### What We're Betting On
[This replaces "What Actually Happened" for the Day 0 entry — list the 5–7
biggest bets this project is making. Things that must be true for the project
to succeed. Pull from PRD assumptions, ARCHITECTURE choices, TECH_STACK choices.]

### Our Current Assumptions (Summary)
[Reference the ASSUMPTION_TRACKER entries just created. List the 3 highest-stakes
ones — the ones where being wrong would most significantly change the project.]

### Known Unknowns
[Things we know we don't know yet. Pull from BRAIN.md and PRD.md open questions.]

### What Would Make Us Change Direction
[The conditions under which we'd significantly pivot. Being explicit about this
now makes it easier to recognise those conditions when they appear.]

### What I'd Tell Myself If Starting Today
[Leave this section as a standing instruction:]
> Return to this entry after v1 launch and complete this section.
> At that point you'll know which of today's beliefs survived contact with reality.
> That comparison — Day 0 beliefs vs. what actually happened — is the complete
> learning story of this project.
```

### Step 4 — Generate INTERVIEW_PREP.md (Initial Version)

```markdown
# INTERVIEW_PREP.md — Technical Review & Interview Preparation

**Project:** [name]
**Last Generated:** [date]
**Generated From:** LEARNING_JOURNAL.md, ASSUMPTION_TRACKER.md, all framework files

> This file is auto-generated. Do not edit manually.
> Regenerate by running GENERATE_JOURNAL.md in MODE: INTERVIEW_PREP.
>
> Every answer cites its source. If an answer has no citation, it has no evidence.

---

## How To Use This File

**For a lead dev review:** Read the Architecture and Decision sections. The answers
tell you what was decided — the citations tell you where to look for deeper context.

**For an interview:** Work through each section. The answers are honest and specific.
If an interviewer asks a follow-up, the cited journal entry or decision log has
the full story.

**For self-review:** The gaps in this file (questions with thin answers or missing
citations) are the gaps in the project's documentation. Fill those gaps.

---

## Section 1 — Product Thinking

**Q: What problem does this product solve and why does it matter?**
A: [From PRD.md problem statement + Day 0 journal entry]
*Source: PRD.md, Journal Day 0*

**Q: Who is the target user and how do you know?**
A: [From PRD.md user description + any ASSUMPTION_TRACKER entries about users]
*Source: PRD.md, ASSUMPTION-[NNN]*

**Q: What did you cut from v1 and why?**
A: [From PRD.md out-of-scope + any journal entries discussing tradeoffs]
*Source: PRD.md*

**Q: What assumptions are you making about user behaviour?**
A: [From ASSUMPTION_TRACKER entries categorised as "User Behaviour"]
*Source: ASSUMPTION-[NNN], ASSUMPTION-[NNN]*

---

## Section 2 — Technical Decisions

**Q: Why did you choose [primary framework]?**
A: [From TECH_STACK.md entry + DECISIONS.md entry if exists]
*Source: TECH_STACK.md, DECISIONS.md [date]*

**Q: Why [database choice]? Why not [most obvious alternative]?**
A: [From TECH_STACK.md + DECISIONS.md]
*Source: TECH_STACK.md*

**Q: How does authentication work and why that approach?**
A: [From ARCHITECTURE.md auth flow + DECISIONS.md + TECH_STACK.md]
*Source: ARCHITECTURE.md, TECH_STACK.md*

**Q: Walk me through the system architecture.**
A: [From ARCHITECTURE.md system overview + key data flows]
*Source: ARCHITECTURE.md*

**Q: What would you change about the architecture if you started over?**
A: [From "What I'd Tell Myself" sections of journal entries — especially any
   that reference architectural decisions]
*Source: [journal entries — will populate as project progresses]*

> ⚠️ This answer will strengthen as the project progresses and journal entries
> accumulate. Regenerate this file after significant milestones.

---

## Section 3 — Problem Solving

**Q: Tell me about a time something didn't go as planned.**
A: [From ERRORS.md entries + corresponding journal entries]
*Source: [will populate as ERRORS.md grows]*

> ⚠️ No errors logged yet. This section populates as ERRORS.md grows.

**Q: Tell me about a decision you made that you later reconsidered.**
A: [From DECISIONS.md entries where a decision was revised + journal entries
   where direction changed]
*Source: [will populate]*

**Q: What's the hardest technical problem you solved in this project?**
A: [From ERRORS.md — entries with greatest complexity or longest time to resolve]
*Source: [will populate]*

---

## Section 4 — Learning & Growth

**Q: What assumptions were you wrong about?**
A: [From ASSUMPTION_TRACKER entries with status ❌ Invalidated]
*Source: [will populate as assumptions are resolved]*

> ⚠️ No invalidated assumptions yet — project is in early phase.

**Q: How did your understanding of the problem evolve?**
A: [From LEARNING_JOURNAL entries tracking assumption changes over time —
   compare Day 0 entry to most recent entries]
*Source: Journal Day 0 + [future entries]*

**Q: What would you do differently if you started this project today?**
A: [Synthesised from all "What I'd Tell Myself" journal sections]
*Source: [will populate]*

**Q: What did you learn that you didn't expect to learn?**
A: [From journal entries where "What We Now Understand" contains something
   not anticipated in the Day 0 entry]
*Source: [will populate]*

---

## Section 5 — Process & Collaboration

**Q: How did you make technical decisions?**
A: The project uses a structured decision log (DECISIONS.md) where every
non-trivial decision records the context, options considered, reasoning, and
reversibility. Decisions were not made in isolation — alternatives were explicitly
evaluated and rejected alternatives are documented.
*Source: DECISIONS.md*

**Q: How did you manage scope?**
A: Scope was fixed in the PRD before building started. Out-of-scope items are
explicitly listed with reasons, not just omitted. New scope requests are evaluated
against the PRD, and any scope changes are logged as decisions.
*Source: PRD.md, DECISIONS.md*

**Q: How would you onboard another developer onto this project?**
A: Read BRAIN.md first (10 minutes — complete project orientation). Then
LEARNING_JOURNAL.md (20 minutes — the story of how it got this way). Then
DECISIONS.md (10 minutes — what's already settled, don't relitigate). Then
CONVENTIONS.md before writing any code.
*Source: All framework files*

---

## Gaps (Questions This File Cannot Yet Answer Well)

[List any standard interview questions for which the current evidence base
is thin — journal entries missing, errors not yet logged, assumptions unresolved.
These are documentation gaps to address.]

- [ ] No errors logged yet — ERRORS.md is empty
- [ ] No invalidated assumptions yet — project too early
- [ ] "What would you change" sections empty — need post-milestone journal entries
- [ ] [Add others based on actual gaps in provided files]
```

---

## MODE: SESSION_LOG

**Use at end of a session where learning occurred.**

### Step 1 — Read Context

Read all provided files. Then answer these questions internally before writing anything:

1. What specifically changed this session? (new decisions, new errors, direction changes)
2. What did the human indicate they learned or were surprised by?
3. Which assumptions were affected — confirmed, denied, or newly created?
4. Does anything from this session change what a future agent needs to know?

### Step 2 — Write Journal Entry

Write one entry to append to LEARNING_JOURNAL.md using the format above.

**Quality checks before finalising:**
- Does "What We Now Understand" contain something genuinely new — not just a
  restatement of what was planned?
- Is "What I'd Tell Myself" honest and specific, or generic and sanitised?
  If it could apply to any project, rewrite it.
- Are specific names, numbers, and error messages used — not vague descriptions?
  "The Prisma connection pool exhausted at 11 concurrent requests in load testing"
  is useful. "There were performance issues" is not.

### Step 3 — Update ASSUMPTION_TRACKER.md

For each assumption affected this session:
- Change status to ✅ ❌ or ⚠️
- Fill in Resolution, Date Resolved, What We Found, Impact
- Add Journal Entry reference (today's date)

For any new assumptions identified this session:
- Add new ASSUMPTION-NNN entries at the bottom

### Step 4 — Partial INTERVIEW_PREP.md Update

Update only the sections affected by today's session:
- If an error was logged: add to Section 3 (Problem Solving)
- If an assumption was invalidated: add to Section 4 (Learning & Growth)
- If a decision was made: update Section 2 if it's an architecture/tech decision
- If direction changed: add to "What would you change" in Section 4

Do not regenerate the entire file — append to affected sections and update
the "Last Generated" date.

---

## MODE: HANDOFF_ORIENTATION

**Use when a new agent is starting on this project.**

### Step 1 — Confirm Files Received

Check which files were provided. If any of these are missing, request them
before proceeding:
- BRAIN.md (required)
- LEARNING_JOURNAL.md (required)
- DECISIONS.md (required)
- ERRORS.md (required)
- PROGRESS.md (required)

### Step 2 — Read in This Exact Order

1. BRAIN.md — understand current state and constraints
2. LEARNING_JOURNAL.md — understand how it got this way
3. DECISIONS.md — know what is settled
4. ERRORS.md — know what has failed
5. PROGRESS.md — know the current task

### Step 3 — Confirm Understanding

Before any build work, produce this summary for human confirmation:

```
ORIENTATION SUMMARY — [date]

Current project state:
[3 sentences describing where the project is]

Last 2 significant decisions:
1. [decision] — [brief reason] — [date]
2. [decision] — [brief reason] — [date]

Last significant error and fix:
[error] → [fix] — [date]

Current task:
[Specific task from PROGRESS.md — not a phase, a task]

What completing this task looks like:
[Concrete definition of done]

Known constraints on this task:
[From GOTCHAS.md, DECISIONS.md, CONVENTIONS.md — anything that constrains
 how this specific task must be approached]

Questions before proceeding:
[Any genuine ambiguities that would affect how to proceed — if none, say none]
```

**Do not proceed until the human confirms this summary is accurate.**

---

## MODE: INTERVIEW_PREP

**Use when preparing for technical review or interview.**

### Step 1 — Full Evidence Extraction

Read all provided files. Build an internal index of:
- Every DECISIONS.md entry → date, decision, reasoning, alternatives rejected
- Every ERRORS.md entry → symptom, root cause, fix, prevention
- Every journal entry → date, learning, assumption changes, direction changes
- Every ASSUMPTION_TRACKER entry → assumption, status, resolution if any

### Step 2 — Regenerate INTERVIEW_PREP.md Fully

Generate the complete file fresh. Every Q&A pair must:
- Contain a specific, honest answer (not "we considered various options")
- Cite at least one source document and date
- Be answerable in 60–90 seconds verbally

### Step 3 — Generate Gap Report

After the main file, append a section:

```
## Preparation Gaps

These are questions a reviewer is likely to ask that this project's documentation
cannot yet answer well. Address these before the review.

### Thin Evidence
[Questions where answers exist but lack specific detail or citations]

### Missing Evidence  
[Questions where no journal entries, decision logs, or error logs exist to support an answer]

### Recommended Actions Before Review
- [ ] [Specific journal entry to write]
- [ ] [Specific decision to document retroactively]
- [ ] [Specific assumption to resolve and log]
```

### Step 4 — Generate 10-Minute Verbal Briefing

At the end of INTERVIEW_PREP.md, add:

```
## 10-Minute Verbal Briefing

If you had 10 minutes to brief a lead dev who had read nothing, say this:

---

[Generate a natural, spoken-language briefing covering:
- What the product is and why (2 minutes)
- The key technical decisions and why (3 minutes)
- The biggest challenge encountered and how it was resolved (2 minutes)
- What you'd do differently and what you learned (2 minutes)
- Current state and what's next (1 minute)

Write it as actual spoken sentences, not bullet points.
A human should be able to read this aloud and sound natural.]
```

---

## MAINTENANCE RULES (for all modes)

### What Makes a Good Journal Entry
✅ Specific names, numbers, library versions, error messages
✅ Honest about what went wrong or took longer than expected
✅ "Why at the time" reasoning — not hindsight rationalisation
✅ Concrete impact on future decisions or direction
✅ Written close to the event — not reconstructed weeks later

### What Makes a Bad Journal Entry
❌ Generic ("we learned a lot about authentication")
❌ Only positive ("everything went smoothly")
❌ No specific details (no library names, no error specifics, no numbers)
❌ Hindsight-only ("obviously X was the wrong approach")
❌ Written to impress rather than to inform

### Assumption Tracker Discipline
- Every "we assume" or "users will probably" or "this should work" = new entry
- Resolve entries within 1 week of getting evidence
- Never delete invalidated assumptions — they are the most valuable entries

### INTERVIEW_PREP.md Regeneration Schedule
- After any milestone (feature shipped, phase completed)
- Before any technical review or interview
- After 3+ session log entries have been added
- Never manually edited — always regenerated from source files

---

## FILE STRUCTURE REFERENCE

```
project-root/
└── journal/
    ├── LEARNING_JOURNAL.md      ← Written by human + agent, every meaningful session
    ├── ASSUMPTION_TRACKER.md    ← Maintained continuously, resolved as evidence arrives
    └── INTERVIEW_PREP.md        ← Auto-generated, never manually edited
```

### Integration with Framework Files

The journal layer reads from framework files. Framework files do not read from
journal files. The flow is one-way:

```
DECISIONS.md ──────→ INTERVIEW_PREP.md (Section 2: Technical Decisions)
ERRORS.md ─────────→ INTERVIEW_PREP.md (Section 3: Problem Solving)
PRD.md ────────────→ INTERVIEW_PREP.md (Section 1: Product Thinking)
ARCHITECTURE.md ───→ INTERVIEW_PREP.md (Section 2: Architecture)
LEARNING_JOURNAL ──→ INTERVIEW_PREP.md (Section 4: Learning & Growth)
ASSUMPTION_TRACKER → INTERVIEW_PREP.md (Section 4: Assumptions)
```

The journal layer does not modify framework files. If a journal session reveals
that a framework file is outdated, flag it to the human — but the framework
file update is a separate action in a build session.

---

## QUICK REFERENCE — TRIGGERS AND ACTIONS

| Situation | Use This Mode | Provide These Files |
|-----------|--------------|---------------------|
| Framework files just generated | INITIAL_SETUP | All 14 framework files + ideation notes |
| Session had a decision or error | SESSION_LOG | BRAIN.md, DECISIONS.md, ERRORS.md, journal files |
| Switching agents | HANDOFF_ORIENTATION | BRAIN.md, LEARNING_JOURNAL.md, DECISIONS.md, ERRORS.md, PROGRESS.md |
| Preparing for review | INTERVIEW_PREP | All 14 framework files + all journal files |
| Assumption resolved | SESSION_LOG (abbreviated) | ASSUMPTION_TRACKER.md + relevant framework files |

---

## ONE-LINE DECISION GUIDE

**Should I write a journal entry today?**
→ Did you update DECISIONS.md or ERRORS.md? → Yes → Write entry
→ Were you surprised by anything? → Yes → Write entry
→ Did an assumption get confirmed or denied? → Yes → Write entry
→ None of the above → Skip. Build without guilt.

---

*GENERATE_JOURNAL.md v1.0 — Learning Journal Layer*
*Companion to GENERATE_FRAMEWORK.md*
*The framework is the machine brain. The journal is the human story.*
*Both are needed. Neither replaces the other.*
