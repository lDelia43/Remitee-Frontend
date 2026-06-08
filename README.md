<p align="center">
  <img width="500" height="300" alt="remitee_banner" src="https://github.com/user-attachments/assets/10f4a173-47f6-4742-97b7-3d45e6a360cb" />
</p>
<p align="center">
  <img width="1914" height="910" alt="Screenshot 2026-06-08 095158" src="https://github.com/user-attachments/assets/d047b30a-6a1b-4d42-9580-f7b9b7208dcf" />
</p>
<p align="center">
  <img width="1918" height="908" alt="Screenshot 2026-06-08 095207" src="https://github.com/user-attachments/assets/35455429-153f-48f3-a63a-201356b52e54" />
</p>
<p align="center">
  <img width="1917" height="908" alt="Screenshot 2026-06-08 095227" src="https://github.com/user-attachments/assets/f13a7163-ff91-4bf0-977e-7ec9cdb2608e" />
</p>

<h1 align="center">Sweet Medical — Frontend</h1>

<p align="center">
  Remitee Technical Challenge 2026 · Next.js 16 + HeroUI v3 + Tailwind CSS v4 + TanStack Query v5
</p>

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- The **backend API** running on `http://localhost:8080` (see the backend repo for setup instructions)

---

## Running the frontend

```bash
# 1. Install dependencies
npm install

# 2. Configure the API URL (already set by default)
# .env.local points to http://localhost:8080
# If your backend runs on a different port, update NEXT_PUBLIC_API_BASE_URL

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Other commands

```bash
npm run build         # Production build + TypeScript check
npm run typecheck     # Type check only (tsc --noEmit)
npm run lint          # ESLint
npm run format        # Prettier (writes changes)
npm run test          # Run test suite (Vitest)
npm run test:coverage # Run tests with V8 coverage report
```

---

## Implemented features

All **four features** of the main flow are implemented:

| Feature                | Description                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **View doctors**       | Card grid showing each doctor's name and specialty                                 |
| **Create appointment** | Form with doctor selection, patient name, and date/time                            |
| **View appointments**  | Table with search, status filter, column sorting, and pagination                   |
| **Cancel appointment** | Confirmation modal with appointment details; disabled if past or already cancelled |

The integration is real-time: creating or cancelling an appointment updates the list automatically without reloading the page, through React Query cache invalidation.

---

## Project structure

```
src/
├── app/                    # Next.js routes (App Router)
│   ├── page.tsx            # Dashboard with stats
│   ├── doctors/            # Doctors view
│   └── appointments/       # Appointments view
├── components/
│   ├── atoms/              # Primitives: Typography, Badge, Spinner, EmptyState, icons
│   ├── molecules/          # Small compositions: StatCard, FormField, SearchInput
│   ├── organisms/          # Feature UI: AppointmentTable, DoctorCardGrid, modals, Navbar
│   └── templates/          # Page shells that wire organisms together
├── services/
│   ├── api/                # Typed Axios clients
│   ├── queries/            # TanStack Query hooks (useDoctors, useAllAppointments)
│   └── mutations/          # Mutation hooks (useCreateAppointment, useCancelAppointment)
├── constants/              # Centralized query keys
├── types/                  # Shared types (Appointment, Doctor, AppointmentStatus)
└── utils/                  # Date formatting, error extraction
```

---

## Technical decisions

### Component architecture — Atomic Design

A four-layer structure (atoms → molecules → organisms → templates) was adopted to keep concerns separated. Pages in `app/` are intentionally thin — they only export metadata and render a single template component. No barrel files (`index.ts`): every import points directly to the component file.

### Remote state — TanStack Query v5

All server state lives in React Query; no Redux or Zustand. Cache invalidation via the `byDoctorAll(doctorId)` prefix allows updating all cached pages for a doctor without knowing the exact pagination params at the call site.

`useAllAppointments()` is a two-step fan-out: it first fetches all doctors, then runs `useQueries` in parallel (one per doctor, `pageSize=100`). This aggregates all appointments on the client, enabling search, filtering, and sorting without additional endpoints.

### HeroUI v3 dot-notation API

HeroUI v3 is built on React Aria. All compound components use dot-notation (`Modal.Backdrop`, `Table.Content`, `Card.Content`, `Select.Trigger`, etc.) to avoid the v2 named imports, which are deprecated.

### Axios with typed errors

The Axios response interceptor enriches every error with `.problem: { title, status }` following the backend's RFC 9110 format. `extractErrorMessage()` centralizes reading these errors for toasts and UI messages.

### Tailwind CSS v4

Configuration is 100% CSS-based (`@import "@heroui/styles"` in `globals.css`). There is no `tailwind.config.ts`. HeroUI theme variables are consumed directly as `var(--accent)`, `var(--muted)`, etc.

---

## AI usage

**Claude (Anthropic)** was used as a development assistant for:

- Initial scaffolding of the folder structure and project configuration.
- Migrating components to the HeroUI v3 API (dot-notation, deprecated props).
- Systematic conversion of `function` declarations to arrow functions across the codebase.
- Debugging React Aria warnings (`PressResponder`, `isFocusable`, `aria-label`).

**Manual review:** all business logic (past-date validation, cache invalidation, filters and sorting), backend endpoint integration, TypeScript typing, and accessibility rules (aria-labels, `isRowHeader`) were reviewed and adjusted by hand. Every generated code block was inspected function by function before committing.

---

## Future improvements

- **Authentication**: add JWT-based login and protected routes.
- **Server-side pagination**: currently fetching `pageSize=100` per doctor and paginating on the client. A global paginated appointments endpoint would scale better.
- **Appointment rescheduling**: allow changing the date/time of an active appointment instead of only cancelling it.
- **Internationalization**: the UI is in English; adding i18n support with `next-intl` to operate in Spanish would be a natural next step.
