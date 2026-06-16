# TECH_STACK.md — Technology Decisions

**Last Updated:** 2026-06-15

> Before installing any new package: check this file.
> After choosing any new technology: add it here immediately.

---

## Core Stack

| Layer | Technology | Version | Why Chosen | Alternatives Rejected |
|-------|------------|---------|------------|----------------------|
| Frontend | Next.js (App Router) | 14.x | Required by Deloitte brief; App Router is latest pattern | Pages Router — older pattern |
| Frontend CSS | Tailwind CSS | 3.x | Fast iteration, utility-first, maps to design tokens | Vanilla CSS — slower dev; Styled Components — SSR issues |
| Backend | FastAPI | 0.100+ | Async support, auto Swagger /docs, Pydantic integration | Flask — no auto-docs/async; Django — too heavy for API |
| ORM | SQLAlchemy | 2.x | DB-agnostic (SQLite ↔ Postgres), mature, clean code | Tortoise ORM — less mature; Raw SQL — harder to maintain |
| Database | PostgreSQL (Supabase) | 15+ | Managed, free tier, JSONB support, same platform as storage | PlanetScale — MySQL; Neon — no file storage |
| File Storage | Supabase Storage | — | Same platform as DB, free tier, public URLs | AWS S3 — separate account; Cloudinary — not for documents |
| AI Model | Gemini Flash 1.5 (Google AI Studio) | 1.5 | Prior experience, free tier, `response_mime_type: "application/json"` | OpenAI — expensive; Claude — no JSON mode |
| PDF Parsing | pdfplumber | latest | Clean text extraction from complex PDF layouts | PyPDF2 — less reliable; Tika — heavy JVM dependency |
| DOCX Parsing | python-docx | latest | Standard .docx text extraction | — |
| Backend Hosting | Render | — | Free tier for Python web services | Railway — less free; AWS — overkill |
| Frontend Hosting | Vercel | — | Canonical Next.js host, free tier | Netlify — less Next.js optimized |
| Domain | Custom domain | — | Professional appearance for submission | Vercel subdomain — less professional |

---

## Package Registry

All confirmed dependencies. Do not install packages not listed here without adding them first.

### Backend — Production Dependencies

```
fastapi — Web framework with auto-generated Swagger docs
uvicorn[standard] — ASGI server for FastAPI
sqlalchemy[asyncio] — ORM for database operations
psycopg2-binary — PostgreSQL adapter for SQLAlchemy
pydantic — Request/response validation (bundled with FastAPI)
python-multipart — Multipart form data parsing (file uploads)
pdfplumber — PDF text extraction
python-docx — DOCX text extraction
supabase — Supabase client for Storage operations
google-generativeai — Google Gemini API client
python-dotenv — Load .env file variables
```

### Backend — Development Dependencies

```
httpx — Async test client for FastAPI
pytest — Test framework
```

### Frontend — Production Dependencies

```
next@14 — React framework with App Router
react@18 — UI library
react-dom@18 — React DOM renderer
tailwindcss — Utility-first CSS framework
@tabler/icons-react — Icon library for sidebar navigation
```

### Frontend — Development Dependencies

```
typescript — Type checking
@types/react — React type definitions
@types/node — Node.js type definitions
postcss — CSS processing for Tailwind
autoprefixer — CSS vendor prefixing
eslint — Code linting
eslint-config-next — Next.js ESLint config
```

---

## Technology Constraints

### Must Use
- FastAPI — required by project decision (not Django/Flask)
- Next.js 14 — required by Deloitte brief
- PostgreSQL — required by brief ("relational database")
- Gemini Flash 1.5 — chosen AI model, must use `response_mime_type: "application/json"`
- SQLAlchemy — chosen ORM for DB-agnostic access

### Must NOT Use
- No CSS-in-JS libraries (Styled Components, Emotion) — use Tailwind only
- No client-side state management libraries (Redux, Zustand) — React state + fetch is sufficient
- No authentication libraries — no auth in v1
- No WebSocket libraries — no real-time features in v1

### Preferred Patterns
- `response_mime_type: "application/json"` over manual JSON parsing from Gemini output
- SQLAlchemy ORM queries over raw SQL strings
- Pydantic schemas over manual request validation
- Tailwind utility classes over custom CSS files
- Server Components (default) over Client Components — add `'use client'` only when needed

---

## Upgrade Policy

- **Patch updates:** Apply freely — security fixes and bug patches
- **Minor updates:** Apply after checking changelog for breaking changes in sub-features
- **Major updates:** Do not upgrade during the 2-day build window. Log upgrade need in DECISIONS.md for post-submission evaluation.

---

## Evaluation Criteria (for adding new tech)

Before adding any new dependency, it must pass:
1. Does an existing package already do this?
2. Is it actively maintained? (last commit within 6 months)
3. Does it conflict with anything in this file?
4. Is it worth the bundle size / install cost?
5. Is it necessary for the demo, or is it a nice-to-have?
