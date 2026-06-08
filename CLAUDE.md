# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build + TypeScript check
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run typecheck    # tsc --noEmit only
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npm run test:coverage  # Vitest + V8 coverage report
```

Run a single test file:

```bash
npx vitest run src/__tests__/utils/date.utils.test.ts
```

The app talks to a backend at `http://localhost:8080` (configured in `.env.local` via `NEXT_PUBLIC_API_BASE_URL`).

## Stack

- **Next.js 16** — App Router, no Pages Router
- **HeroUI v3** — compound component API with dot-notation (see below)
- **Tailwind CSS v4** — configured entirely via CSS imports, no `tailwind.config.ts`
- **TanStack Query v5** — all remote state; no Redux, no Zustand
- **Axios** — response interceptor attaches `.problem: { title, status }` to every error
- **Vitest + React Testing Library** — unit/integration tests in `src/__tests__/`

## Code style

- **Arrow functions only** — no `function` declarations anywhere. Use `export const X = () => ...`
- **Concise arrow form** for components that only return JSX: `export const X = (props) => (...)`
- **Block form** for components with logic: `export const X = (props) => { ...; return (...); }`

## Architecture

### Component layers (Atomic Design)

```
atoms/       → stateless primitives (Typography, Badge, Spinner, EmptyState, ErrorMessage, icons/)
molecules/   → small compositions (StatCard, SearchInput, FormField, ThemeSwitcher, AppointmentStatusBadge)
organisms/   → feature-level UI (DashboardStats, DoctorCardGrid, AppointmentTable, AppointmentForm, modals, Navbar)
templates/   → page shells that wire organisms together (DashboardTemplate, DoctorsTemplate, AppointmentsTemplate)
```

Each component lives in its own folder with only an `index.tsx`. Icons live in `atoms/icons/` as `camelCase.icon.tsx` files. **No barrel `index.ts` files** — always import directly from the component path:

```ts
import { Badge } from "@/components/atoms/Badge";
import { CalendarIcon } from "@/components/atoms/icons/calendar.icon";
```

Pages in `src/app/` are thin — they export metadata and render one template component.

### Data flow

```
API (localhost:8080) → Axios (services/api/) → React Query hooks (services/queries|mutations/) → organisms/templates
```

Query keys live in `src/constants/query-keys.ts`. The `byDoctorAll(doctorId)` key prefix is used as a wildcard to invalidate or optimistically update **all cached pages** for a doctor without knowing the exact pagination params at the call site.

`useAllAppointments()` is a two-step fan-out: fetches all doctors first, then runs `useQueries` in parallel for each doctor's appointments with `pageSize=100`. This is the only place appointment data is aggregated across all doctors.

### Theme

`useTheme()` from `@heroui/react` manages dark/light mode. Stores preference in `localStorage` under `heroui-theme`, applies `.dark` / `.light` to `<html>`. `globals.css` starts with `@import "@heroui/styles"` which includes Tailwind v4 — do not add a separate `@import "tailwindcss"`.

### API contract

Backend: `http://localhost:8080`

| Method  | Path                                      | Notes                                                                        |
| ------- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| `GET`   | `/doctors`                                | Returns `{ doctors: [{id, name, specialty}] }` — no pagination               |
| `GET`   | `/appointments?doctorId=&page=&pageSize=` | Returns `{ appointments: [...], totalCount, page, pageSize, totalPages }`    |
| `POST`  | `/appointments`                           | Body: `{doctorId, patientName, scheduledAt}` — `scheduledAt` is UTC ISO 8601 |
| `PATCH` | `/appointments/:id/cancel`                | Returns `{id, status}`                                                       |

Errors follow RFC 9110: `{ title: string, status: number }`. `extractErrorMessage()` in `src/utils/error.utils.ts` handles this. `AppointmentStatus` values are `"Active"` and `"Cancelled"` (capitalized).

### Tests

Tests live in `src/__tests__/` mirroring the source tree. Setup file is `src/test/setup.ts` — it registers `@testing-library/jest-dom` matchers and exports `createWrapper()` for React Query hook tests.

All test imports are explicit (no `globals: true`):

```ts
import { describe, it, expect, vi } from "vitest";
```

Hooks are tested by mocking the API modules with `vi.mock()` and wrapping with `createWrapper()`:

```ts
import { createWrapper } from "@/test/setup";
vi.mock("@/services/api/appointments.api");

const { wrapper, queryClient } = createWrapper();
const { result } = renderHook(() => useCreateAppointment(), { wrapper });
```

## HeroUI v3 API

HeroUI v3 is built on React Aria. All compound components use **dot-notation**. Named subcomponent imports (`ModalContainer`, `CardContent`, `TableBody`, etc.) exist but are the old API — use dot-notation instead.

**Deprecated props** (from react-stately): `selectedKey` → `value`, `defaultSelectedKey` → `defaultValue`, `onSelectionChange` → `onChange`.

**Button**:

```tsx
// variants: "primary" | "secondary" | "tertiary" | "danger" | "danger-soft" | "ghost" | "outline"
<Button variant="primary" isDisabled={loading}>
  Save
</Button>
```

No `color`, no `startContent`, no `isPending` props.

**Card**:

```tsx
<Card>
  <Card.Content className="p-5">...</Card.Content>
</Card>
```

**Modal** — controlled via `isOpen` / `onOpenChange`. Because `ModalRoot` internally wraps children with a `PressResponder`, a visually-hidden `Modal.Trigger` must be the first child — otherwise React Aria logs a `<Pressable> child must be focusable` warning. Do **not** use `display: none` (makes element non-focusable); use the sr-only pattern:

```tsx
<Modal isOpen={open} onOpenChange={onClose}>
  <Modal.Trigger
    aria-hidden="true"
    tabIndex={-1}
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0,0,0,0)",
      whiteSpace: "nowrap",
      border: 0,
      opacity: 0,
    }}
  />
  <Modal.Backdrop>
    <Modal.Container>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Heading>Title</Modal.Heading>
        </Modal.Header>
        <Modal.Body>...</Modal.Body>
        <Modal.Footer>...</Modal.Footer>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
</Modal>
```

**Select** — use `value` / `onChange` (not `selectedKey` / `onSelectionChange`). `textValue` is required on every `ListBox.Item`. `placeholder` goes on `Select` root, not on `Select.Value`:

```tsx
<Select
  value={value || null}
  onChange={(key) => onChange(key?.toString() ?? "")}
  placeholder="Select an option"
>
  <Label>Label</Label>
  <Select.Trigger>
    <Select.Value />
    <Select.Indicator />
  </Select.Trigger>
  <Select.Popover>
    <ListBox>
      <ListBox.Item key="a" id="a" textValue="Option A">
        Option A
      </ListBox.Item>
    </ListBox>
  </Select.Popover>
</Select>
```

**Table** — `aria-label` goes on `Table.Content` (the actual `<table>` element), not the `Table` wrapper. At least one `Table.Column` must have `isRowHeader`:

```tsx
<Table>
  <Table.ScrollContainer>
    <Table.Content aria-label="Appointments">
      <Table.Header>
        <Table.Column isRowHeader>Name</Table.Column>
        <Table.Column>Date</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row key="1">
          <Table.Cell>...</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Content>
  </Table.ScrollContainer>
</Table>
```

**Toast**:

```tsx
import { toast } from "@heroui/react";
toast.success("Title", { description: "..." });
toast.danger("Title", { description: "..." });
// ToastProvider placement: "top" | "top start" | "top end" | "bottom" | "bottom start" | "bottom end"
```

**Chip** (used inside `Badge` atom):

```tsx
<Chip color="success" variant="soft" size="sm">
  Active
</Chip>
// colors: "accent" | "success" | "warning" | "danger" | "default"
```
