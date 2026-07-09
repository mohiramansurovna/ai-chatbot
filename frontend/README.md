# Frontend

## Overview

The frontend is a Vite + React + TypeScript single-page application for authentication, dashboard navigation, and chat experiences. It is designed to work with the NestJS backend and currently focuses on login, registration, session browsing, and chat interactions.

## Tech stack

- React 19 and TypeScript
- Vite for development and builds
- TanStack Query for server-state management
- Zustand for persisted auth state
- React Router for navigation
- Tailwind CSS and shadcn-style UI primitives

## Folder structure

```text
src/
  components/      Reusable UI components
  hooks/           Shared hooks
  layouts/         Layout wrappers
  lib/             Utility modules, query client, JWT helpers
  pages/           Route-based page modules and feature hooks
  router.tsx       Route configuration
  schemas.ts       Zod schemas for API data
```

## Prerequisites

- Node.js 20+
- pnpm
- A running backend instance

## Installation

```bash
cd frontend
pnpm install
```

## Environment variables

The frontend currently expects a single environment variable:

| Variable     | Required | Notes                                  |
| ------------ | -------- | -------------------------------------- |
| VITE_API_URL | Yes      | Base URL used for backend API requests |

Example:

```env
VITE_API_URL=http://localhost:5173
```

## Running locally

```bash
cd frontend
pnpm dev
```

The Vite dev server typically runs on http://localhost:5173.

## Build commands

```bash
pnpm build
pnpm lint
pnpm preview
```

## Routing

Routing is defined in [src/router.tsx](./src/router.tsx) and uses React Router. The current routes are:

- /login
- /register
- /chat
- /

The root route redirects into the chat experience.

## State management

- Zustand powers the persisted authentication store in [src/pages/dashboard/hooks/useAuthStore.ts](./src/pages/dashboard/hooks/useAuthStore.ts).
- TanStack Query is used for async server-state flows such as login, session loading, and refresh handling.

## UI libraries

The UI layer uses a Tailwind-based setup with components and utilities from the following libraries:

- Tailwind CSS
- lucide-react
- radix-ui
- react-markdown and remark-gfm for message rendering
- react-syntax-highlighter for code blocks

## API integration

The frontend currently performs API requests directly from feature hooks and page-level logic. The main flows are:

- auth login and registration
- session creation and retrieval
- chat message submission
- API key submission for LLM providers

A centralized API client file exists in [src/api.ts](./src/api.ts), but the current implementation still relies on direct fetch calls in feature hooks in several places.

## Project conventions

- Feature folders are organized by page and route under [src/pages](./src/pages).
- Shared validation uses Zod schemas from [src/schemas.ts](./src/schemas.ts).
- UI components are separated from page logic and hooks.
- Path aliases are used throughout the project.

## Deployment notes

No dedicated deployment configuration is included in the repository yet. The current build output is the standard Vite production bundle.
