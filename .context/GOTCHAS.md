# GOTCHAS.md — Known Traps & Fragile Areas

**Last Updated:** 2026-06-15

> Search this file before debugging any non-obvious issue.
> Add to this file any time you encounter a trap that took more than 15 minutes to diagnose.

---

## Framework-Specific Gotchas

---

## Server vs Client Components (Next.js App Router)
**Context:** Any component using hooks (`useState`, `useEffect`), browser APIs, or event listeners
**The Trap:** Using `useState`/`useEffect` in a Server Component throws at runtime with a confusing error. App Router defaults all components to Server Components.
**The Fix:** Add `'use client'` directive at the very top of the file. Default to Server Components — only add `'use client'` when the component actually needs hooks, event listeners, or browser APIs.
**Tags:** Next.js, App Router, React

---

## Next.js App Router — Layout vs Page Data Fetching
**Context:** Fetching data in layouts vs pages
**The Trap:** Layouts don't re-render on navigation between sibling routes. If you fetch data in a layout, it won't refresh when navigating between pages that share that layout.
**The Fix:** Fetch page-specific data in the `page.tsx` file, not in `layout.tsx`. Use layouts only for shared UI (sidebar, headers) that doesn't depend on route params.
**Tags:** Next.js, App Router, data fetching

---

## Tailwind CSS — Dynamic Class Names
**Context:** Using template literals or string concatenation for Tailwind classes
**The Trap:** Tailwind purges unused classes at build time by scanning source files. Dynamic class names like `bg-${color}` are never found in the source scan and get purged.
**The Fix:** Always use complete, literal class names. Use conditional logic with full strings: `score >= 70 ? 'bg-score-high-fill text-score-high-text' : 'bg-score-low-fill text-score-low-text'`. Alternatively, add dynamic values to `safelist` in `tailwind.config.ts`.
**Tags:** Tailwind CSS, build

---

## FastAPI — CORS Middleware Order
**Context:** Adding CORS middleware for cross-origin requests from Next.js frontend
**The Trap:** CORS middleware must be added before route registration. If added after, preflight OPTIONS requests fail silently and the frontend gets opaque network errors.
**The Fix:** Add `CORSMiddleware` immediately after creating the `FastAPI()` app instance, before any `app.include_router()` calls. Allow origins: `["*"]` for development, restrict in production.
**Tags:** FastAPI, CORS, middleware

---

## FastAPI — File Upload Requires python-multipart
**Context:** Using `UploadFile` parameter in FastAPI endpoints
**The Trap:** FastAPI's `UploadFile` silently requires the `python-multipart` package. Without it, file upload endpoints throw a runtime error: `No module named 'multipart'`.
**The Fix:** Always include `python-multipart` in `requirements.txt`. Install it before testing any file upload endpoint.
**Tags:** FastAPI, file upload, dependencies

---

## SQLAlchemy — Session Management in FastAPI
**Context:** Using SQLAlchemy sessions with FastAPI's async request handling
**The Trap:** Creating a global session and reusing it across requests causes thread-safety issues and stale data. Sessions are not thread-safe.
**The Fix:** Use a session factory with `Depends(get_db)` that creates a new session per request and closes it when done:
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
**Tags:** SQLAlchemy, FastAPI, database

---

## Supabase Storage — Public URL Construction
**Context:** Getting the public URL for an uploaded file in Supabase Storage
**The Trap:** The Supabase client's upload response doesn't always return the full public URL. The URL format differs between `authenticated` and `public` buckets.
**The Fix:** Construct the public URL manually: `{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_path}`. Ensure the bucket is configured as public for read access.
**Tags:** Supabase, Storage, URLs

---

## Gemini Flash — JSON Response Parsing
**Context:** Using `response_mime_type: "application/json"` for structured output
**The Trap:** Even with JSON response mode, Gemini occasionally wraps the response in markdown code fences (```json ... ```) or includes trailing text. Directly calling `json.loads()` on the response text will fail.
**The Fix:** Strip markdown code fences before parsing. Implement a cleanup function that removes leading/trailing whitespace, code fences, and any non-JSON text. Always log the raw response in the `raw_response` field for debugging.
**Tags:** Gemini, AI, JSON parsing

---

## Gemini Flash — Rate Limiting on Free Tier
**Context:** Bulk matching (POST /match/bulk/{jd_id}) sends multiple Gemini requests in sequence
**The Trap:** Google AI Studio free tier has rate limits (typically 60 requests per minute). Bulk matching with many candidates can hit this limit, causing 429 errors mid-batch.
**The Fix:** Add a small delay (0.5–1 second) between sequential Gemini calls in bulk operations. Consider processing in batches of 10 with a 5-second pause between batches. Log which candidates failed and allow retry.
**Tags:** Gemini, rate limiting, bulk operations

---

## pdfplumber — Scanned PDFs Return Empty Text
**Context:** Extracting text from PDF resumes
**The Trap:** pdfplumber extracts text from text-based PDFs only. Scanned PDFs (images of text) return empty strings because there's no text layer.
**The Fix:** Check if extracted text is empty or very short (< 50 characters). If so, return an error to the user: "This PDF appears to be a scanned image. Please upload a text-based PDF or DOCX file." Do NOT attempt OCR — it's out of scope.
**Tags:** pdfplumber, PDF, file parsing

---

## Render Free Tier — Cold Start Latency
**Context:** Backend deployed on Render free tier
**The Trap:** Render free tier spins down the service after 15 minutes of inactivity. The first request after spin-down takes 30–60 seconds (cold start) while the container boots.
**The Fix:** Add a `/health` endpoint. Set up an external uptime monitor (e.g., UptimeRobot) to ping `/health` every 14 minutes. This keeps the service warm during demo hours. Warn evaluators about potential first-load delay in the README.
**Tags:** Render, deployment, performance

---

## Project-Specific Gotchas

---

## UUID Generation — Python vs PostgreSQL
**Context:** Generating UUIDs for primary keys
**The Trap:** If UUIDs are generated both in Python code and via PostgreSQL defaults, you might get inconsistencies or null IDs depending on which path creates the record.
**The Fix:** Generate UUIDs in Python using `uuid.uuid4()` and pass them explicitly when creating SQLAlchemy model instances. Don't rely solely on database-level UUID generation — it makes testing harder and can cause issues with Supabase.
**Tags:** UUID, SQLAlchemy, PostgreSQL

---

## FastAPI Route Priority Conflict
**Context:** Creating dynamic parameters and static paths in the same router
**The Trap:** Declaring a highly dynamic route pattern (like `/{candidate_id}/{jd_id}`) before a static prefix route pattern (like `/bulk/{jd_id}`) will cause FastAPI to match the literal segment `"bulk"` as the `candidate_id` parameter, returning a `404 Not Found` for the bulk route.
**The Fix:** Always declare static prefix routes or routes with fewer/less generic parameters *before* highly dynamic parametric endpoints.
**Tags:** FastAPI, routing, priority

---

## Next.js Cache Synchronization (Webpack 404s)
**Context:** Switching between `npm run build` and `npm run dev` hot-reloading
**The Trap:** Running a production build and immediately starting development server mode can leave stale webpack hot-reload cache assets in the `.next/` directory. This causes scripts to throw opaque 404 errors for dynamic chunks (like `webpack.js` or `948.js`), breaking the frontend.
**The Fix:** Manually clear the compilation cache by executing `rm -rf frontend/.next` before restarting the dev server.
**Tags:** Next.js, Webpack, cache, hot-reload

---

## Sandboxed Browser CDP DNS Resolution
**Context:** E2E automated browser testing inside sandbox containers
**The Trap:** System-level Chrome DevTools Protocol (CDP) sandboxing can block local loopback DNS lookup for `127.0.0.1` or `localhost`, causing automated navigation tools like `open_browser_url` to fail.
**The Fix:** Hand off E2E path verification to manual human checking if loopback DNS lookups are blocked in the test sandbox environment.
**Tags:** CDP, DNS, testing, browser-subagent

> Add to this file any time you encounter a trap that took more than 15 minutes to diagnose.
