# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Education Evaluation Management System (教学评价管理系统) for Wuxu University Novosibirsk College. A Vue 3 SPA for administrators to manage teaching evaluations, students, teachers, courses, and question banks.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Type-check + production build (runs in parallel via npm-run-all2)
- `npm run type-check` — Run `vue-tsc --build` only
- `npm run preview` — Preview production build

No test runner or linter is configured.

**Node.js requirement**: `^20.19.0 || >=22.12.0`

## Tech Stack

- Vue 3 (Composition API with `<script setup lang="ts">`)
- TypeScript (~5.9, `noUncheckedIndexedAccess` enabled)
- Vite 7 (bundler)
- Pinia 3 (state management, Composition API style)
- Vue Router 5 (HTML5 history mode)
- Element Plus (UI components, custom purple theme `#6f2b75` in `src/styles/element-plus-theme.css`)
- Axios (HTTP client)
- Font Awesome (icons via `@fortawesome/vue-fontawesome`)
- Maple Mono CN (monospace font)

## Architecture

**Path alias**: `@/` → `src/`

### Directory Layout

- `src/api/` — API layer (class-based, one file per domain)
- `src/stores/` — Pinia stores
- `src/router/` — Vue Router config with auth guards
- `src/views/` — Page components organized by feature subdirectory (evaluation/, teacher/, teaching-course/, question/)
- `src/components/` — Shared components (NavigationBar, Footer, layout wrapper)
- `src/types/` — TypeScript interfaces (`type.ts`)
- `src/styles/` — Global styles

### API Layer

All API modules extend `ApiClient` (`src/api/api-client.ts`) which wraps Axios with:
- JWT auto-attached via `Authorization: Bearer <token>` request interceptor
- Automatic error display via `ElMessage` (suppress with `silent: true` config)
- Success toast via `showSuccess: true` config
- Response normalization: copies `msg` → `message` for backend inconsistency
- 401 responses clear the token and dispatch `auth-expired` event

Access APIs via the unified entry point:
```ts
import { api } from '@/api'
api.task.getList(params)
```

API domains: `auth`, `baseInfo` (students/teachers), `course`, `task` (evaluation tasks), `question`. All endpoints use `/api/v1/` prefix.

### Authentication

- JWT stored in `localStorage`, decoded via `jwt-decode` in the Pinia `user` store
- Router `beforeEach` guard requires auth by default; opt out with `meta: { requiresAuth: false }`
- 401 handling: clears token, dispatches `auth-expired` custom event, redirects to `/`
- Cross-tab auth sync via `storage` and `auth-expired` events

### Routing Conventions

- All routes use lazy loading (`() => import(...)`)
- Route names are in Chinese (e.g., `name: '评教任务管理'`)
- List pages use `layout.vue` wrapper with `<keep-alive>` via `meta.KeepAlive`
- Wildcard `/:pathMatch(.*)*` catch-all renders 404

### Dev Proxy

Vite proxies `/api` requests to `VITE_API_URL` from `.env.development`. In production, `ApiClient` reads `VITE_API_URL` directly. No path rewrite is needed.

## Code Conventions

- `<script setup lang="ts">` and `<style scoped>` on all Vue components
- Composition API exclusively (no Options API)
- Local `ref()`/`reactive()` state in views; no global state beyond auth
- API calls made directly in `onMounted` and event handlers (no composables/hooks layer)
- Element Plus components for all UI (tables, forms, dialogs, pagination, messages)
- UI text, route names, and comments are in Chinese
- View pages follow a consistent pattern: page header + filter card + data table card + create/edit dialogs + import dialog
- File names: PascalCase for Vue components
- Types imported from `@/types/type`
