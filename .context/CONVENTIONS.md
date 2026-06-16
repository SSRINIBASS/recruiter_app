# CONVENTIONS.md — Coding Conventions

**Last Updated:** 2026-06-15

> Read this before writing any new code.
> When in doubt about a pattern, check here.
> If a pattern isn't here and isn't obvious: add it after deciding.

---

## File Naming

### Frontend (Next.js / TypeScript)
- Components: `PascalCase.tsx` (e.g., `Sidebar.tsx`, `MatchCard.tsx`)
- Pages (App Router): `page.tsx` inside named folder (e.g., `app/candidates/page.tsx`)
- Layouts: `layout.tsx` inside route folder
- Utilities: `camelCase.ts` (e.g., `api.ts`, `formatDate.ts`)
- Types: `camelCase.ts` in `types/` or co-located (e.g., `types/index.ts`)
- Constants: `UPPER_SNAKE_CASE` for values, `camelCase.ts` for files

### Backend (Python / FastAPI)
- Modules: `snake_case.py` (e.g., `file_parser.py`, `gemini.py`)
- Routes: `snake_case.py` inside `routes/` (e.g., `routes/candidates.py`)
- Services: `snake_case.py` inside `services/` (e.g., `services/storage.py`)
- Models (SQLAlchemy): `models.py` — class names in `PascalCase` (e.g., `Candidate`, `AIAnalysis`)
- Schemas (Pydantic): `schemas.py` — class names in `PascalCase` (e.g., `CandidateCreate`, `CandidateResponse`)

---

## Frontend Component Structure

```tsx
// Order: imports → types → component → exports
import { ... } from '...'

type Props = {
  score: number
  label?: string
}

export function ScoreBar({ score, label }: Props) {
  // 1. hooks first
  // 2. derived values
  // 3. handlers
  // 4. return JSX
}
```

### Rules:
- Default to Server Components — only add `'use client'` when hooks, event listeners, or browser APIs are needed
- All props must be typed — no `any`
- No default exports for components — use named exports
- Keep components focused — one component per file

---

## Backend Route Structure

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import CandidateResponse
from ..models import Candidate

router = APIRouter(prefix="/candidates", tags=["candidates"])

@router.get("/", response_model=list[CandidateResponse])
async def list_candidates(db: Session = Depends(get_db)):
    """List all candidates."""
    candidates = db.query(Candidate).all()
    return candidates
```

### Rules:
- Always use `APIRouter` with prefix and tags
- Always declare `response_model` for type safety and auto-docs
- Always use dependency injection for DB session (`Depends(get_db)`)
- Always add docstring for Swagger documentation
- Use `HTTPException` for error responses with appropriate status codes

---

## Import Order

### Frontend (TypeScript)
1. React and framework imports (`next/...`, `react`)
2. Third-party libraries (`@tabler/icons-react`)
3. Internal absolute imports (`@/components/...`, `@/lib/...`)
4. Relative imports (`./...`)
5. Types (last, with `import type` if applicable)

### Backend (Python)
1. Standard library (`uuid`, `datetime`, `typing`)
2. Third-party (`fastapi`, `sqlalchemy`, `pydantic`)
3. Internal imports (`from .database import ...`, `from .services import ...`)

---

## State Management

- **No state management library** — React state (`useState`, `useEffect`) + direct fetch calls via `lib/api.ts`
- Form state: controlled components with `useState`
- Loading/error states: local component state, always handle both
- Server data: fetch on mount with `useEffect`, store in local state

---

## Error Handling

### Frontend
- All `fetch` calls: wrapped in try/catch
- Loading states: always shown while data is being fetched (spinner or skeleton)
- Error states: always shown on failure (user-friendly message, not raw error)
- Pattern:
```tsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  async function load() {
    try {
      const result = await api.getCandidates()
      setData(result)
    } catch (err) {
      setError('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])
```

### Backend
- All service calls (Gemini, Supabase): wrapped in try/except
- Known errors: raise `HTTPException` with specific status code and detail message
- Unexpected errors: log the full error, return 500 with generic message — never expose raw errors to client
- Gemini JSON parsing failures: log raw response, retry once, then return 500

---

## API Calls (Frontend)

- All calls go through `lib/api.ts` — **never fetch directly in components**
- Base URL from `NEXT_PUBLIC_API_URL` environment variable
- Pattern:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const api = {
  async getCandidates(): Promise<Candidate[]> {
    const res = await fetch(`${API_URL}/candidates`)
    if (!res.ok) throw new Error('Failed to fetch candidates')
    return res.json()
  },
  // ... all other endpoints
}
```

---

## TypeScript Rules

- No `any` types — use `unknown` if type is truly unknown
- All props and function params must be typed
- No non-null assertions (`!`) unless safety is provable — add comment explaining why
- Prefer `interface` for object types, `type` for unions and intersections
- All API response types defined in `types/` directory

---

## Python Type Hints

- All function parameters and return types must have type hints
- Use Pydantic models for all request/response schemas
- Use `Optional[T]` for nullable fields
- Use `list[T]` (Python 3.10+) over `List[T]`

---

## Comments

- Comment the "why", not the "what"
- Complex business logic: always commented
- Workarounds or hacks: always commented with `TODO` and the reason
- No commented-out code in commits
- Gemini prompt templates: always have a comment explaining the expected output format

---

## Git Conventions

- Branch naming: `[type]/[short-description]` (e.g., `feat/candidate-upload`, `fix/gemini-parse-error`)
- Commit format: `[type]: [description]` (e.g., `feat: add resume upload endpoint`)
- Types: `feat` / `fix` / `chore` / `docs` / `refactor` / `test` / `style`

---

## Environment Variables

- Backend: all in `.env` file, loaded via `python-dotenv`, never committed
- Frontend: in `.env.local` file, `NEXT_PUBLIC_` prefix for client-side vars
- Never hardcode API keys, database URLs, or service credentials in source code
- Always provide `.env.example` with placeholder values

---

## Do This / Not That

| ✅ Do | ❌ Don't |
|-------|---------|
| Use `lib/api.ts` for all API calls | Fetch directly in components |
| Use Pydantic schemas for validation | Manually validate request bodies |
| Use SQLAlchemy ORM queries | Write raw SQL strings |
| Add `'use client'` only when needed | Add `'use client'` to every component |
| Handle loading + error states in UI | Show empty/broken UI during loading |
| Use design system tokens from Tailwind config | Use arbitrary color/spacing values |
| Use `HTTPException` for error responses | Return raw Python exceptions |
| Type all function params and returns | Use `any` or skip type annotations |
| Use named exports for components | Use default exports |
| Store secrets in `.env` | Hardcode credentials in source files |
