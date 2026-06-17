# DESIGN_SYSTEM.md — Visual & UI Rules

**Last Updated:** 2026-06-15

> Before building any UI component: read this file.
> Before using any color, font, or spacing value: check the tokens below.

---

## Design Philosophy

Clean corporate aesthetic inspired by Notion and Linear — flat surfaces, tight borders, generous whitespace. The personality comes from a single indigo accent color used sparingly; everything else is neutral. **No gradients, no shadows, no animations** — fast to render for HR daily use. The interface must be scannable: a recruiter should be able to glance at a candidate row and understand their status in 2 seconds.

## Color Tokens

```css
/* Brand — Indigo accent */
--color-accent:            #5B5BD6;   /* Active nav, primary buttons, score bars, AI badges */
--color-accent-light:      #EEEDFE;   /* Badge backgrounds, hover states */
--color-accent-text:       #3C3489;   /* Text on accent-light backgrounds */

/* Neutrals — CSS variables auto-switch for dark mode */
--color-surface-primary:   white;     /* Page background (light mode) */
--color-surface-secondary: #F7F7F8;  /* Stat cards, table headers, secondary areas */
--color-border:            rgba(0, 0, 0, 0.15);  /* 0.5px borders, subtle separators */
--color-text-primary:      #1A1A1A;  /* Primary text */
--color-text-secondary:    #6B6B6B;  /* Secondary/meta text */

/* Score — Semantic colors for match scores */
--color-score-high-fill:   #E1F5EE;  /* Score ≥ 70 — background */
--color-score-high-text:   #085041;  /* Score ≥ 70 — text */
--color-score-mid-fill:    #FAEEDA;  /* Score 40–69 — background */
--color-score-mid-text:    #633806;  /* Score 40–69 — text */
--color-score-low-fill:    #FCEBEB;  /* Score < 40 — background */
--color-score-low-text:    #791F1F;  /* Score < 40 — text */

/* Status badges */
--color-status-analyzed:   #E1F5EE;  /* Green badge — analysis complete */
--color-status-analyzed-text: #085041;
--color-status-pending:    #FAEEDA;  /* Amber badge — awaiting analysis */
--color-status-pending-text: #633806;

/* Destructive */
--color-destructive-fill:  #FCEBEB;  /* Delete button background */
--color-destructive-text:  #791F1F;  /* Delete button text */
```

## Typography

```
Font:          System sans-serif — Geist (via Next.js default font)
Weights used:  400 (regular), 500 (medium) — only these two, no others
```

### Type Scale

```
--text-xs:    11px / 1.4   — Tags, chips, uppercase labels, delta text
--text-sm:    13px / 1.5   — Meta labels, secondary text, status badges
--text-base:  14px / 1.6   — Body text, table data, form inputs
--text-lg:    16px / 1.5   — Page titles, card headings (weight 500)
--text-xl:    22px / 1.3   — Stat card numbers (weight 500)

Minimum font size: 12px (exception: 11px for tags/chips only)
```

## Spacing System

Base unit: 4px

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-6:   24px
--space-8:   32px
--space-12:  48px
--space-16:  64px
```

## Border Radius

```
--radius-sm:    6px    — Inputs, small chips, skill tags
--radius-md:    8px    — Buttons, cards
--radius-lg:    10px   — Stat cards, modals
--radius-full:  9999px — Pills, avatars, status badges
```

## Shadows

```
No shadows in this design system.
The design relies on borders and background color differences for visual hierarchy.
```

## Component Rules

### Sidebar Navigation
- Logo mark: indigo square with briefcase icon + "Eligo" app name
- Nav items: Tabler outline icons, 14px text, weight 400
- Active state: indigo text (#5B5BD6) + indigo-light background (#EEEDFE)
- Inactive state: secondary text color, no background
- Section dividers: uppercase 11px labels, weight 500, secondary text color
- Width: fixed, does not collapse

### Stat Cards (Dashboard — 4-column grid)
- Background: `--color-surface-secondary` (#F7F7F8)
- No border, border-radius 10px
- Label: 11px uppercase, weight 500, secondary text color
- Number: 22px, weight 500, primary text color
- Delta/subtitle: 11px, secondary text color
- Padding: 16px

### Candidate/Data Table Rows
- Avatar: 28–32px circle, `--color-accent-light` background, initials in `--color-accent-text`
- Name: 14px, weight 500
- Meta fields: 13px, weight 400, secondary text color
- Inline score bar: 4px height track (surface-secondary), indigo fill, score number right-aligned
- Status badge: pill shape (border-radius full), semantic color fill + text
- Row hover: subtle background change

### Match Leaderboard Cards
- Rank number: left-aligned, large (#1, #2, …), weight 500
- Avatar + name + role: standard row layout
- Fit analysis: 14px, regular weight, secondary text color
- Skill tags: green pill for matched skills (`--color-score-high-fill` + `--color-score-high-text`), gray pill for gaps (surface-secondary + secondary text)
- Score: large number + small inline bar
- Top-ranked card: 1px indigo border accent (only visual distinction for #1)
- "View profile" button: `--color-accent-light` background, `--color-accent-text` text

### Buttons
- **Primary:** `--color-accent` background, white text, 8px border-radius, weight 500
- **Secondary:** `--color-accent-light` background, `--color-accent-text` text, no border, 8px radius
- **Destructive:** `--color-destructive-fill` background, `--color-destructive-text` text, 8px radius
- **Disabled:** 50% opacity, no pointer events
- Height: 36px, padding: 8px 16px
- Font: 14px, weight 500

### Forms
- Label position: above input, 13px, weight 500, secondary text color
- Input: full width, 36px height, 6px radius, 1px border (`--color-border`)
- Input focus: 2px indigo border (`--color-accent`)
- Error state: red border, red text below
- Required field: asterisk (*) after label
- Textarea: same styling, min-height 120px for description fields

### Drag-Drop Upload
- Dashed border area, 2px dashes, `--color-border` color
- Center-aligned icon + "Drop your resume here" text + "or browse files" link
- Accepted formats indicator: "PDF, DOCX" in secondary text
- Active drag state: indigo dashed border, accent-light background

---

## Never Do (UI Anti-Patterns)

- Never use inline styles — all values must come from the token system above
- Never use a color not in the token list — add it first if needed
- Never use arbitrary spacing values — use the spacing scale
- Never use gradients, box shadows, or CSS animations
- Never use more than 2 font weights (400 and 500)
- Never use font sizes below 11px
- Never use rounded corners larger than 10px (except pills at 9999px)
- Never use colored backgrounds for entire pages — white/near-black only

## Responsive Breakpoints

```
Desktop-only design. No responsive breakpoints defined.
Minimum supported width: 1024px.
The app is designed for desktop HR use — mobile is explicitly out of scope.
```

## Tailwind Config Mapping

These design tokens should be mapped in `tailwind.config.ts`:

```typescript
// Colors
colors: {
  accent: { DEFAULT: '#5B5BD6', light: '#EEEDFE', text: '#3C3489' },
  score: {
    high: { fill: '#E1F5EE', text: '#085041' },
    mid: { fill: '#FAEEDA', text: '#633806' },
    low: { fill: '#FCEBEB', text: '#791F1F' },
  },
  surface: { primary: '#FFFFFF', secondary: '#F7F7F8' },
  destructive: { fill: '#FCEBEB', text: '#791F1F' },
}

// Font sizes mapped to type scale
fontSize: {
  xs: ['11px', { lineHeight: '1.4' }],
  sm: ['13px', { lineHeight: '1.5' }],
  base: ['14px', { lineHeight: '1.6' }],
  lg: ['16px', { lineHeight: '1.5' }],
  xl: ['22px', { lineHeight: '1.3' }],
}
```
