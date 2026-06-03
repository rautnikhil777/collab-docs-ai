# Architecture

## Decisions

- **No real authentication**: MVP uses a seeded user selector and `x-user-email` request header.
- **Rich text persistence as HTML**: Persist `contentHtml` from React Quill for reliable reopen/edit behavior. (Optional Delta backup is not implemented to keep MVP small.)
- **MVP sharing model**:
  - Owner: single email
  - Shared With: array of emails
  - No complex permissions.
- **Uploads**: Accept `.txt` and `.md` and convert them into Quill-compatible HTML.

## Tradeoffs

- Storing HTML is simpler than storing and reconciling Quill Delta JSON for an MVP.
- Sharing is email-based and relies on the client-provided header (no auth). This is intentional for MVP scope.

## Architecture Diagram

```mermaid
flowchart LR
  U[Seeded User UI\n(owner/reviewer)] -->|x-user-email header| FE[React + Vite + React Quill]
  FE --> API[Express API]
  API --> DB[(MongoDB Atlas)]
  FE --> UP[Upload UI]
  UP --> API
  API -->|multer upload| S[Upload converter\n(txt/md -> HTML)]
  S --> API
  API --> DB
```

## Future Improvements

- Add real authentication (e.g., Clerk/Auth0) and server-side authorization.
- Implement Delta persistence + migration.
- Add realtime collaboration (WebSockets) and conflict resolution.
- Add version history and comments.

