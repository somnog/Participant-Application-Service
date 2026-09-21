# Participant-Application-Service-Frontend

Frontend for **participant-application-service**
(`somnog/Participant-Application-Service`, `apps/participant-application-service`).

Stack (same as the Day-2 mentor setup): **Next.js 16 · React 19 · Ant Design 6 · axios**, port **3004**.

## Run

```bash
# 1. backend (in Participant-Application-Service)
docker compose up -d            # postgres + app on :3000

# 2. frontend (this folder)
cp .env.example .env.local      # BACKEND_URL=http://localhost:3000
npm install
npm run dev                     # http://localhost:3004
```

The browser calls `/api/...` on port 3004. `next.config.ts` forwards it to the
backend (`/api/participants` → `http://localhost:3000/participants`), so the
backend needs no CORS setup.

## Folder structure — mirrors the backend

```
app/                                   routes (pages)
  page.tsx                             "/" → /dashboard
  dashboard/
    layout.tsx                         sidebar
    page.tsx                           overview counts
    participants/page.tsx              list, search, sort, create, edit, remove
    participants/[id]/page.tsx         details + the participant's applications
    applications/page.tsx              list, filters, bulk status
    applications/[id]/page.tsx         details + change status
shared/
  ipconfig.ts                          the one axios instance (baseURL /api)
  pagination.ts                        { data, meta } list shape
  errors.ts                            NestJS error message reader
  format.ts
packages/
  participants/                        <-> src/participants/
    dto/*.dto.ts                       <-> dto/*.dto.ts (same names)
    participant.types.ts               <-> model Participant (schema.prisma)
    participants.service.ts            <-> participants.controller.ts routes
    components/
  applications/                        <-> src/applications/
    dto/*.dto.ts                       <-> dto/*.dto.ts incl. bulk-status.dto.ts
    application.types.ts               <-> model Application + enum ApplicationStatus
    applications.service.ts            <-> applications.controller.ts routes
    components/
  layout/
test/                                  vitest unit tests
```

## Backend routes used

| Frontend call | Backend route |
|---|---|
| `participantsService.create` | `POST /participants` |
| `participantsService.findAll` | `GET /participants?search&sortBy&order&page&limit` |
| `participantsService.findOne` | `GET /participants/:id` (includes applications) |
| `participantsService.update` | `PATCH /participants/:id` |
| `participantsService.remove` | `DELETE /participants/:id` (soft delete, 204) |
| `applicationsService.create` | `POST /applications` |
| `applicationsService.findAll` | `GET /applications?status&workshopId&track&page&limit` |
| `applicationsService.findOne` | `GET /applications/:id` |
| `applicationsService.update` | `PATCH /applications/:id` |
| `applicationsService.bulkUpdateStatus` | `POST /applications/bulk-status` |

Statuses are exactly the Prisma enum: `pending`, `approved`, `rejected`, `enrolled`.

## Check

```bash
npm run typecheck
npm test
npm run build
```

## Docker

```bash
docker build --build-arg BACKEND_URL=http://app:3000 -t pas-frontend .
docker run -p 3004:3004 pas-frontend
```
