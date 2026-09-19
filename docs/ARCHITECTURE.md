# SET — Architecture Overview

## System shape

SET uses a layered architecture with multiple presentation surfaces and one shared product domain.

```text
Next.js web UI           React/Vite/Capacitor mobile UI
       ↓                           ↓
         Feature / Application services
                     ↓
                   Domain
                     ↓
          Infrastructure / API adapters
                     ↓
      Supabase + weather + AI provider
```

The key architectural decision is that wardrobe rules, recommendation behavior, personalization, taxonomy normalization, and weather reasoning should not be owned by individual screens.

## Presentation surfaces

### Web

The web application uses Next.js and React for routing, layouts, authenticated product screens, responsive desktop/mobile behavior, and server/client boundaries.

### Dedicated mobile client

The mobile development branch contains a separate React/Vite/Capacitor client. It owns native-facing interaction concerns such as mobile navigation and device integrations while reusing the same core recommendation domain.

The current mobile package includes Capacitor integrations for camera, geolocation, haptics, and local notifications. These are implementation capabilities in the development branch, not a claim of app-store release.

## Feature / Application layer

Feature modules coordinate user interactions and data loading. Examples include:

- Dress Me;
- daily recommendations;
- planner;
- wear history;
- Stylist chat;
- travel / suitcase flows.

This layer can compose domain functions, persistence services, and UI state, but it does not redefine core outfit rules.

## Domain layer

Pure product logic includes:

- outfit structure and invariants;
- recommendation candidate generation and ranking;
- styling compatibility;
- weather / thermal reasoning;
- personalization;
- taxonomy normalization;
- structured Stylist intent parsing and sanitization.

Domain modules are intentionally independent of React screens, Next.js routing, and Supabase UI code.

## Infrastructure and API boundaries

Infrastructure adapters handle persistence, authentication, storage, weather data, and external providers.

The Stylist demonstrates this boundary clearly:

```text
User message
   ↓
Authenticated /api/stylist/interpret
   ↓
Gemini interpretation when configured
   ↓
Sanitize to an allowed intent schema
   ↓
Deterministic parser fallback
   ↓
Shared recommendation domain
```

The external model is not asked to create an outfit directly. It only translates language into bounded constraints. Recommendation validity remains deterministic and inspectable.

## Recommendation flow

```text
User context + direct request constraints
   ↓
Normalize taxonomy / requested colors
   ↓
Filter explicit exclusions
   ↓
Generate bounded candidate templates
   ↓
Validate hard structural invariants
   ↓
Score styling coherence + context
   ↓
Apply confidence-aware personalization
   ↓
Prefer minimum-quality results
   ↓
Use best valid fallback pool when necessary
   ↓
Apply session-aware diversity ranking
```

## Why these boundaries matter

The same rules need to behave consistently in manual outfit building, Dress Me, the daily home recommendation, the Stylist, travel mode, and the mobile client.

For example, a dress cannot be combined with a bottom because one screen forgot to disable a control. The domain-level validator owns that rule regardless of which surface initiated the request.

Similarly, the Stylist cannot "hallucinate" a garment into a look because the final result is generated from the authenticated user's actual wardrobe dataset.

## State and server data

The web application uses server-first loading where appropriate and TanStack Query for interactive client-side cache coordination, mutations, invalidation, and responsive feedback.

The mobile client uses Supabase authentication and mobile-specific data adapters while sharing recommendation logic.

Multi-entity operations that must remain atomic are handled at the persistence boundary rather than inside UI components.

## Internationalization and interface copy

SET supports Hebrew and English, including RTL behavior. Gender-aware interface phrasing is treated as a presentation concern and does not change recommendation scoring.

## Showcase note

This document describes the current architecture represented in the private development branches as of September 19, 2026. The public repository contains selected modules and documentation rather than the complete deployable application.
