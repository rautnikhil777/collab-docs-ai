# collab-docs-ai (MVP)

Lightweight collaborative document editor inspired by Google Docs for an AI-native engineering assessment.

## Tech Stack

- Frontend: React + Vite + React Quill
- Backend: Node.js + Express
- Database: MongoDB Atlas (via `MONGO_URI` in `.env`)
- File uploads: Multer

## Prerequisites

- Node.js 18+
- MongoDB Atlas URI

## Project Structure

- `frontend/` - Vercel deploy target
- `backend/` - Render deploy target

## Local Setup

### 1) Backend

```bash
cd backend
cp .env.example .env
npm i
npm run dev
```

Backend expects:
- `MONGO_URI` (MongoDB Atlas connection string)
- `PORT` (e.g. 4000)
- `FRONTEND_URL` (e.g. http://localhost:5173)

### 2) Frontend

In a separate terminal:

```bash
cd frontend
cp .env.example .env
npm i
npm run dev
```

Frontend expects:
- `VITE_BACKEND_URL` (e.g. http://localhost:4000)

## Seed Users (No Auth)

The app uses a lightweight selector UI. No real authentication is implemented.

Seeded users:
- `owner@example.com`
- `reviewer@example.com`

The frontend sends `x-user-email` with requests.

## Run

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## Deployment

### Deploy Frontend to Vercel

1. Create a Vercel project from the `frontend/` folder.
2. Set Build Command:
   - `npm run build`
3. Set Output Directory:
   - `dist`
4. Add Environment Variables in Vercel:
   - `VITE_BACKEND_URL` = https://YOUR_RENDER_BACKEND_URL

5. Ensure the frontend uses `VITE_BACKEND_URL` during API calls.

### Deploy Backend to Render

1. Create a Render Web Service from the `backend/` folder.
2. Set Start Command:
   - `npm run start`
3. Set Environment Variables:
   - `PORT` = 4000 (or Render-provided port)
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `FRONTEND_URL` = https://YOUR_VERCEL_APP_URL

4. Ensure Render allows outbound network to MongoDB Atlas.

## Walkthrough Verification Checklist

After running locally:
- Create a new document
- Edit with rich text toolbar and save
- Reopen an existing document
- Upload a `.txt` or `.md` file and confirm it becomes editable
- Share with `reviewer@example.com`
- Confirm the document appears under **Shared With Me**

## Backend Test

Run one automated test:

```bash
cd backend
npm test
```

