# SET — Product Walkthrough

SET is a mobile-first wardrobe system with responsive web behavior and a dedicated native-facing mobile client in development.

The screenshots in this repository represent an earlier visual snapshot. The development notes below describe newer functionality that is verified in the current branches but is not necessarily pictured.

## 1. Personalized home

The home screen provides a context-aware daily recommendation instead of a static dashboard.

The recommendation can use wardrobe data, user preferences, weather context, and recommendation-history signals. Current development work also refines the daily-recommendation path and related wear-history data.

**Screenshot:** `assets/screenshots/home-mobile.png`

## 2. Digital closet

The closet is the structured source of truth for wardrobe items.

Users can organize and inspect clothing through metadata such as category, color, material, fit, comfort, temperature behavior, occasion, and styling context. This structure is what allows later recommendation logic to reason about real items rather than image-only records.

**Screenshot:** `assets/screenshots/closet-mobile.png`

## 3. Adding and enriching an item

Adding an item is a guided flow. The product aims to collect enough information to improve later recommendations without turning setup into a long data-entry task.

**Screenshot:** `assets/screenshots/add-item-mobile.png`

## 4. Dress Me recommendations

Dress Me is the main structured recommendation surface.

Users choose or imply context and receive ranked looks built from their wardrobe. The pipeline combines hard outfit constraints with styling coherence, occasion, practicality, comfort, weather, personalization, and diversity.

Direct request constraints can also include preferred colors, exclusions, silhouette, activity, environment, and layer preference.

**Screenshot:** `assets/screenshots/dress-me-mobile.png`

## 5. Conversational SET Stylist

The newer Stylist flow lets the user describe a need naturally, for example:

> Date tonight, effortless but no jeans.

The message is interpreted into a bounded recommendation context. The system can use AI interpretation when configured, but it also includes a deterministic fallback.

The recommendation engine — not the language model — then selects valid looks from the user's wardrobe.

The Stylist exists in both the web development branch and the dedicated mobile branch.

See [AI Stylist](AI_STYLIST.md).

## 6. Saved outfits

Saved combinations can be reviewed, reused, and treated as personalization evidence.

The planner can rank saved outfits for a target context rather than treating every saved look as equally suitable.

**Screenshot:** `assets/screenshots/outfits-desktop.png`

## 7. Travel / suitcase mode

Travel mode creates a trip-scoped wardrobe from the user's main closet.

Recommendation flows can operate on the packed subset while reusing the same structural, styling, weather, and personalization rules.

**Screenshot:** `assets/screenshots/suitcase-desktop.png`

## 8. Dedicated mobile client

The mobile branch uses React, Vite, and Capacitor.

It has its own navigation and mobile interaction layer, but recommendation logic is shared with the broader SET domain. The current package includes native-facing integrations for camera, geolocation, haptics, and local notifications.

This should be read as active development, not as an app-store release claim.

## Product principles visible across the system

- **Mobile-first by use case** — the core interaction happens while choosing clothes, getting dressed, or packing.
- **Progressive disclosure** — rich wardrobe metadata is collected without forcing one oversized form.
- **Correctness before creativity** — outfit structure is validated before ranking.
- **Explainable context** — occasion, weather, comfort, and direct user constraints remain inspectable.
- **AI as an interpretation layer** — language understanding is separated from wardrobe selection.
- **Graceful fallback** — both AI interpretation and recommendation thresholds have fallback behavior.
- **Shared domain rules** — web and mobile should not diverge in what constitutes a valid or relevant look.
- **Product continuity** — closet → recommendations → saved outfits → planning → travel → Stylist all operate on the same wardrobe model.

> SET is actively under development. Visual design, recommendation logic, and native capabilities continue to evolve.
