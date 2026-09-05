# SET — Smart Wardrobe & Outfit Recommendation Platform

SET is a product-focused wardrobe platform that helps users organize their closet, build valid outfits, plan what to pack for trips, and receive personalized outfit recommendations based on **occasion, styling coherence, weather, comfort, and learned preferences**.

> **Portfolio showcase:** this repository is a curated snapshot of selected engineering work from a private production codebase. SET is **actively under development**, and its architecture, recommendation logic, UX, testing, and security hardening continue to evolve. Production credentials, administrative scripts, user data, deployment configuration, and internal tooling are intentionally excluded from this showcase.

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

SET is designed mobile-first while retaining a full desktop workflow for managing and reviewing wardrobe data, saved outfits, planning, and travel.

### Rich wardrobe metadata

<p align="center">
  <img src="assets/screenshots/add-item-mobile.png" width="300" alt="SET add item comfort and weather metadata flow" />
</p>

The guided item flow captures structured metadata that later becomes recommendation input — including category, appearance, fit, comfort, temperature behavior, styling context, and other attributes.

For a feature-by-feature walkthrough, see [`docs/PRODUCT_WALKTHROUGH.md`](docs/PRODUCT_WALKTHROUGH.md).

## My role

I lead SET's product and technical direction and translate product requirements into concrete UX flows, data structures, domain rules, and recommendation behavior.

My work on the project includes:

- product definition and feature design;
- mobile-first UX and responsive behavior;
- wardrobe and outfit domain modeling;
- recommendation constraints, scoring behavior, and iteration;
- Next.js / Supabase application integration;
- debugging, testing, refactoring, and implementation review;
- Hebrew / English and RTL product behavior.

The code and documentation selected for this showcase focus on engineering decisions and product behavior that I can explain and defend in a technical interview.

## Why I built it

Owning clothes is not the same as knowing what works together. SET models wardrobe items as structured data and turns styling decisions into an explainable recommendation pipeline rather than a random combination generator.

The product is designed around a few core principles:

- **Structural correctness first** — invalid combinations are rejected before ranking.
- **Context matters** — an outfit for a wedding is evaluated differently from an everyday or travel outfit.
- **Weather is multidimensional** — temperature, later temperature drops, wind, rain, environment, and personal sensitivity all affect recommendations.
- **Personalization should earn confidence** — learned preferences influence ranking only when there is enough evidence.
- **Diversity is part of quality** — recommendations should rotate through the wardrobe instead of repeatedly surfacing the same few garments.

## Selected engineering highlights

### Recommendation pipeline

```text
Context validation
      ↓
Candidate generation
      ↓
Hard structural constraints
      ↓
Styling + context scoring
      ↓
Personal preference layer
      ↓
Quality threshold
      ↓
Diversity-aware ranking
```

The engine uses bounded candidate templates instead of brute-forcing every subset of wardrobe items. Candidates are filtered by canonical outfit invariants and then scored across multiple dimensions.

### Canonical outfit invariants

SET has a single domain-level validator for outfit structure. For example:

- a dress / one-piece is a complete base and cannot be combined with pants or a primary top;
- separates require a valid top + bottom core;
- layering is allowed only when the garments form a physically plausible layer combination;
- complete recommendations include exactly one footwear slot and respect limits on bags and outerwear.

Keeping these rules in the Domain layer prevents UI-specific workarounds from creating contradictory behavior elsewhere in the product.

### Weather-aware layering

The thermal model estimates outfit warmth from category, subtype, fabric, layering, footwear, and explicit temperature metadata. It can distinguish between:

- **layer required** — the current outfit is materially too cold;
- **layer recommended** — for example, a significant evening temperature drop or strong wind;
- **layer not needed** — the base outfit is already thermally sufficient.

### Personalization

Personalization is applied as a confidence-aware refinement layer rather than overriding general styling quality. The model can learn affinities for silhouette grammar, category combinations, footwear pairings, palette, formality, materials, individual items, and recurring item pairs.

## Architecture

SET follows a layered architecture:

```text
Presentation
    ↓
Feature / Application
    ↓
Domain
    ↓
Infrastructure adapters
```

The Domain layer is intentionally independent of React, Next.js, Supabase, and provider-specific APIs. This keeps recommendation, outfit validation, personalization, and weather logic testable as pure business logic.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`docs/RECOMMENDATION_ENGINE.md`](docs/RECOMMENDATION_ENGINE.md).

## Tech stack

- **Next.js / React / TypeScript**
- **Supabase / PostgreSQL / Row Level Security**
- **TanStack Query**
- **Zod + React Hook Form**
- **Vitest + React Testing Library**
- **Playwright**
- **Vercel**
- Responsive PWA, Hebrew/English i18n and RTL support

## Code samples in this repository

The `code-samples/` directory contains real, selected modules from the private codebase:

- [`generateRecommendations.ts`](code-samples/recommendation/generateRecommendations.ts) — orchestration of candidate generation, scoring, quality gating, and diversity.
- [`validateOutfitInvariants.ts`](code-samples/outfits/validateOutfitInvariants.ts) — canonical structural rules shared across the product.
- [`thermal.ts`](code-samples/weather/thermal.ts) — weather suitability and optional-layer reasoning.

These samples intentionally retain their original domain imports to show how the modules fit into the production architecture. The showcase itself is **not a deployable production clone**.

## Product areas

- Digital closet and item metadata
- Outfit builder
- Personalized “Dress Me” recommendations
- Occasion-aware ranking
- Weather-aware outfit suitability
- Optional layer recommendations
- Travel / suitcase mode
- Outfit history and rotation
- English / Hebrew interface with RTL support
- Responsive mobile-first UI and PWA behavior

## Engineering decisions worth discussing

I documented several decisions I would be happy to walk through in an interview, including:

1. why structural invariants run before recommendation scoring;
2. why personalization is confidence-weighted instead of absolute;
3. why candidate generation is bounded rather than combinatorial;
4. how weather suitability is separated from style coherence;
5. how diversity penalties prevent recommendation collapse onto a small subset of the wardrobe.

See [`docs/ENGINEERING_CASE_STUDY.md`](docs/ENGINEERING_CASE_STUDY.md).

## Development status

SET is an **active, evolving product**, not a finished demo. New features, algorithm refinements, data-model changes, UX improvements, automated tests, and security controls are being added iteratively.

Security is treated as an ongoing engineering process rather than a one-time milestone. The private production repository can be re-audited at meaningful release points, and this showcase should be re-reviewed before each substantial public update.

See [`docs/SECURITY_REVIEW_CHECKLIST.md`](docs/SECURITY_REVIEW_CHECKLIST.md) for the reusable review template used for future audits.

## Security & scope

This public-facing snapshot does **not** contain:

- environment files or production credentials;
- Supabase service-role credentials;
- destructive or administrative scripts;
- raw production user-data exports or private storage assets;
- internal AI/tooling directories;
- deployment-only configuration.

The production repository remains private and separate from this showcase.

---

**Project:** SET  
**Status:** Active development  
**Focus:** Full-stack product development · recommendation systems · domain modeling · UX engineering
