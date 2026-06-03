# TODO

## Project scaffold plan (approved)

1. Create documentation + env example at repo root
   - README.md
   - ARCHITECTURE.md (include architecture diagram section)
   - AI_WORKFLOW.md
   - SUBMISSION.md
   - .env.example

2. Create backend (Node + Express + MongoDB)
   - backend/package.json + server/app structure
   - Mongo models: User, Document
   - Routes: documents CRUD+rename+save, uploads (.txt/.md -> Quill HTML), seed users
   - Error handling + validation
   - One automated test

3. Create frontend (React + Vite + React Quill)
   - UI: login selector (seeded users only), sidebar with My/Shared, editor page, upload section, share modal
   - API client adds x-user-email header
   - Rich text toolbar
   - Loading/empty/error states

4. Deployment readiness
   - Exact Vercel steps for frontend
   - Exact Render steps for backend

5. Add walkthrough preparation
   - Demo seed route + sample documents generation
   - Reviewer credentials section in SUBMISSION.md

## Progress
- [x] Root docs + `.env.example` created.
- [x] Backend scaffold created.
- [x] Frontend scaffold created.


## After scaffold
- [ ] Install dependencies
- [ ] Run backend + frontend locally
- [ ] Verify CRUD, upload conversion, sharing
- [ ] Prepare deployment



