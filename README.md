# SET | Smart Wardrobe & Outfit Recommendation Platform

SET is a mobile-first wardrobe product that turns a user's real closet into structured data and uses it to support everyday outfit decisions, planning, travel, and personalized styling.

I am building SET around a simple product problem: owning more clothes does not necessarily make getting dressed easier. The product reduces that decision friction by combining wardrobe structure, explicit styling rules, weather context, and learned user preferences.

> **Portfolio showcase:** this repository is a curated product and engineering snapshot based on a private implementation. SET is actively under development. Credentials, user data, administrative scripts, deployment configuration, and internal tooling are intentionally excluded.

## Verified development snapshot — September 19, 2026

The current development branches extend the earlier September iteration in four important areas:

- **Conversational SET Stylist:** users can describe what they need in natural language, such as an occasion, preferred colors, comfort level, exclusions, activity, environment, or whether they want an extra layer. The request is translated into structured recommendation constraints and applied to the user's actual wardrobe.
- **AI with deterministic fallback:** the authenticated interpretation endpoint can use Gemini when configured, while a deterministic parser keeps the flow functional without the external model. The AI layer interprets intent; it does not invent wardrobe items.
- **Recommendation and planning refinement:** recommendation generation now handles direct exclusions, normalized requested colors, session-level item and structure diversity, sparse-closet fallback behavior, and stronger coordination with daily recommendations and planner ranking.
- **Dedicated mobile client:** the mobile branch contains a React/Vite/Capacitor client with native-facing integrations and a Stylist flow that reuses the shared recommendation domain instead of maintaining a separate styling algorithm.

These points are verified against the current development branches. They should not be read as a claim that every feature has already been released to the public production branch or app stores.

See [Product iteration](docs/PRODUCT_ITERATION.md), [AI Stylist](docs/AI_STYLIST.md), and [Architecture](docs/ARCHITECTURE.md).

## Product preview

<p align="center">
  <img src="assets/screenshots/home-mobile.png" width="260" alt="SET personalized home and daily outfit recommendation" />
  &nbsp;&nbsp;
  <img src="assets/screenshots/dress-me-mobile.png" width="260" alt="SET Dress Me personalized recommendation flow" />
  &nbsp;&nbsp;
  <img src="assets/screenshots/closet-mobile.png" width="260" alt="SET digital closet" />
</p>

<p align="center"><sub>Personalized daily look · Dress Me recommendations · Digital closet</sub></p>

### Responsive product experience

![SET saved outfits desktop experience](assets/screenshots/outfits-desktop.png)

SET is designed mobile-first because the main use case happens close to the wardrobe and during everyday decision-making. The desktop experience supports broader reviewing, organizing, planning, and travel workflows. A dedicated Capacitor-based mobile client is also being developed from the same product model.

### Rich wardrobe metadata

<p align="center">
  <img src="assets/screenshots/add-item-mobile.png" width="300" alt="SET add item comfort and weather metadata flow" />
</p>

The item flow captures only information that can become useful later, including category, appearance, fit, comfort, temperature behavior, styling context, and occasion suitability.

For a feature-by-feature walkthrough, see [`docs/PRODUCT_WALKTHROUGH.md`](docs/PRODUCT_WALKTHROUGH.md).

## Product problem

SET addresses several recurring wardrobe problems:

- users own many items but repeatedly wear a small subset;
- deciding what works together creates unnecessary daily friction;
- weather changes whether a visually good outfit is actually practical;
- recommendation products can create technically possible but structurally wrong combinations;
- saved and worn looks contain preference signals that should improve future suggestions;
- packing creates a temporary wardrobe with different inventory constraints;
- natural-language styling requests should map to real wardrobe constraints rather than produce imaginary products.

The goal is not just to catalog clothing. It is to help users make better wardrobe decisions with less effort.

## Core product journey

```text
Add wardrobe items
      ↓
Enrich useful metadata
      ↓
Build / save outfits
      ↓
Ask SET what to wear
      ↓
Apply occasion + weather + comfort + style constraints
      ↓
Learn from saved and worn looks
```

The conversational Stylist provides another entry point into the same recommendation engine. Travel mode applies the same model to a trip-scoped wardrobe.

## My role

I lead SET's product direction, UX, recommendation behavior, and end-to-end implementation.

My work includes:

- defining the product problem, feature priorities, and user journeys;
- designing the mobile-first UX, forms, filters, recommendation flows, and conversational styling experience;
- deciding which wardrobe attributes are useful enough to collect from users;
- translating styling expectations into explicit product rules and edge cases;
- defining recommendation behavior for occasion, weather, comfort, personalization, diversity, and user-supplied constraints;
- designing travel mode and trip-scoped wardrobe behavior;
- building the product with Next.js, React, TypeScript, Supabase, PostgreSQL, and a dedicated React/Vite/Capacitor mobile client;
- designing data flows, authentication behavior, storage, API boundaries, and product state;
- testing and debugging recommendation quality across web and mobile;
- supporting Hebrew / English, RTL, and gender-aware interface copy.

The technical implementation is important, but the central product work is deciding **what the system should know, what it should ask, how it should behave, and how to keep recommendations useful rather than merely plausible**.

## Key product and UX decisions

### Correctness before creativity

A recommendation is not useful if the outfit is structurally invalid. Dress exclusivity, valid separates, footwear requirements, and plausible layering are enforced before ranking.

### Personalization should grow with evidence

SET does not treat a small number of user actions as absolute preference. Saved, built, rated, and worn looks become evidence whose influence increases with confidence.

### Natural language should become explicit constraints

The Stylist does not replace the recommendation engine with free-form AI output. A user message is interpreted into a bounded schema — occasion, silhouette, comfort, colors, exclusions, layer preference, activity, and environment — and those values are passed into the same domain logic used elsewhere.

### Graceful degradation matters

If the external AI interpreter is unavailable, SET can fall back to deterministic parsing. If a sparse wardrobe produces no candidate above the preferred score threshold, the engine can still return the best available valid pool rather than fail with an empty experience.

### Web and mobile should share product logic

The native-facing mobile client has its own interaction layer, but it reuses recommendation and personalization logic so the same wardrobe rules do not drift between surfaces.

### Travel is a different wardrobe context

A suitcase is a temporary subset of the user's closet. Travel mode reuses the same wardrobe and recommendation system while constraining eligible inventory to the trip.

## Core product areas

- Digital closet
- Guided Add Item flow
- Manual outfit builder
- Saved outfits
- Personalized Dress Me recommendations
- Conversational SET Stylist
- Daily home recommendation
- Occasion-aware recommendation behavior
- Weather and optional-layer logic
- Comfort and temperature preferences
- Recommendation swaps and iteration
- Outfit history and wardrobe rotation
- Planner
- Travel / suitcase mode
- English / Hebrew interface
- RTL and gender-aware copy
- Responsive web / PWA behavior
- Dedicated Capacitor mobile client in development

## Conversational SET Stylist

The current development flow is deliberately constrained:

```text
Natural-language request
        ↓
Authenticated interpretation endpoint
        ↓
AI interpretation when configured
        ↓
Sanitized structured intent
        ↓
Deterministic fallback when needed
        ↓
Shared recommendation engine
        ↓
Looks built only from the user's wardrobe
```

This separates language understanding from styling logic. The language layer converts intent; the recommendation domain remains responsible for validity, context, personalization, weather, and diversity.

See [`docs/AI_STYLIST.md`](docs/AI_STYLIST.md).

## Recommendation system

SET treats outfit generation as a constrained ranking problem, not random combinatorics.

```text
Wardrobe + user context
        ↓
Explicit request filters
        ↓
Candidate generation
        ↓
Structural validation
        ↓
Styling + occasion + weather + comfort scoring
        ↓
Confidence-aware personalization
        ↓
Preferred quality threshold
        ↓
Sparse-closet fallback when required
        ↓
Session-aware diversity ranking
```

Direct request constraints can include preferred colors, excluded garments/material keywords, minimum comfort, silhouette, activity level, environment, and layer preference.

See [`docs/RECOMMENDATION_ENGINE.md`](docs/RECOMMENDATION_ENGINE.md).

## Technical architecture

SET follows a layered structure with multiple presentation surfaces:

```text
Web UI             Mobile UI
  ↓                   ↓
Feature / Application services
          ↓
        Domain
          ↓
Infrastructure / API adapters
          ↓
Supabase + external providers
```

The Domain layer keeps recommendation, outfit validation, personalization, taxonomy, and weather logic independent from React screens and provider-specific APIs.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Tech stack

- **Next.js / React / TypeScript**
- **Supabase / PostgreSQL / Row Level Security**
- **TanStack Query**
- **Zod + React Hook Form**
- **Vitest + React Testing Library**
- **Playwright**
- **Vercel**
- **PWA**
- **React / Vite / Capacitor mobile client**
- **Capacitor Camera, Geolocation, Haptics, Local Notifications**
- **Gemini intent interpretation when configured, with deterministic fallback**
- **Hebrew / English i18n, RTL, and gender-aware interface copy**

## Selected code samples

The `code-samples/` directory contains selected modules from the private codebase:

- [`generateRecommendations.ts`](code-samples/recommendation/generateRecommendations.ts) — orchestration, request filtering, quality handling, and diversity.
- [`validateOutfitInvariants.ts`](code-samples/outfits/validateOutfitInvariants.ts) — canonical structural outfit rules.
- [`thermal.ts`](code-samples/weather/thermal.ts) — weather suitability and optional-layer reasoning.
- [`parseStylistRequest.ts`](code-samples/stylist/parseStylistRequest.ts) — bounded natural-language intent parsing and sanitization for the Stylist.

The showcase is intentionally not a deployable production clone.

## Product questions I can discuss in an interview

- Which item attributes are worth asking users to enter, and which create unnecessary friction?
- How do you prevent invalid outfits before ranking them?
- How should an elegant item be reused in everyday contexts without weakening occasion rules?
- How do saved and worn outfits become personalization evidence?
- How should a recommendation system behave when wardrobe metadata is incomplete?
- How do you prevent repeated garments from dominating consecutive recommendation batches?
- What belongs in an AI language layer versus a deterministic recommendation domain?
- How do you make an AI-assisted feature useful when the external model is unavailable?
- How do you keep web and native mobile behavior consistent without duplicating business logic?
- How should travel mode reuse the same product logic with a different inventory scope?

See [`docs/ENGINEERING_CASE_STUDY.md`](docs/ENGINEERING_CASE_STUDY.md) for deeper implementation decisions.

## Product status

SET is in **active development**. The private repository remains the canonical implementation. The current development work spans the web application and a separate native-facing mobile client, while this public repository remains a curated portfolio snapshot.

Existing screenshots represent an earlier visual snapshot and should not be treated as evidence of every current development feature.

## Security and scope

This showcase intentionally excludes:

- environment files and production credentials;
- Supabase service-role credentials;
- external-provider API keys;
- destructive or administrative scripts;
- raw production user-data exports or private storage assets;
- internal AI/tooling directories;
- deployment-only configuration.

---

**Project:** SET  
**Status:** Active development  
**Focus:** Product management · UI/UX · recommendation systems · AI-assisted product flows · full-stack execution
