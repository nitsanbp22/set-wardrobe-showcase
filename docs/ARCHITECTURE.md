# SET — Architecture Overview

## Layered design

SET uses a layered architecture with explicit dependency direction:

```text
Presentation → Feature / Application → Domain
                              ↓
                      Infrastructure adapters
```

### `app` / Presentation
Routing, layouts, route composition, and server/client boundaries.

### Feature / Application layer
User-facing feature modules, forms, hooks, schemas, and application services. This layer coordinates user interactions but delegates business decisions to the Domain layer.

### Domain layer
Pure business logic for:

- outfit structure and invariants;
- recommendation candidate generation and ranking;
- styling compatibility;
- weather / thermal reasoning;
- personalization;
- taxonomy normalization.

Domain modules are intentionally independent of React, Next.js, Supabase, and provider-specific APIs.

### Infrastructure
Adapters for persistence, authentication, storage, and external data providers. In production this includes Supabase/PostgreSQL and weather provider integration.

## Why this boundary matters

The same rules need to behave consistently in the manual outfit builder, recommendation engine, travel mode, and future surfaces. Keeping them in the Domain layer avoids duplicating rules in UI components.

For example, a dress cannot be combined with a bottom simply because one screen forgot to disable a button. The canonical outfit validator rejects that state regardless of which feature created it.

## Recommendation flow

```text
User context
   ↓
Normalize context + wardrobe taxonomy
   ↓
Generate bounded candidate templates
   ↓
Validate hard structural invariants
   ↓
Score styling coherence + context
   ↓
Apply confidence-aware personalization
   ↓
Minimum-quality gate
   ↓
Diversity-aware ranking
```

## State and server data

The production application uses server-first loading where appropriate and TanStack Query for interactive client-side cache coordination, mutation feedback, invalidation, and optimistic UX.

Database access is isolated from pure domain scoring. Multi-entity operations that must remain atomic are handled at the persistence boundary rather than inside UI components.

## Internationalization and responsive UI

The application supports English and Hebrew, including RTL behavior. Interface-gender phrasing is isolated to language presentation and does not influence recommendation results.

The UI is mobile-first and designed as a PWA, with touch-target constraints, responsive layout behavior, and mobile-specific interaction patterns such as bottom-sheet selectors.

## Showcase note

This document describes the architecture of the private production project. This repository contains selected domain modules rather than the complete deployable application, so infrastructure and UI implementation details are intentionally omitted from the public-facing snapshot.
