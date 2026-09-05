# SET — Product Walkthrough

SET is designed as a mobile-first wardrobe system with a responsive desktop experience. This walkthrough highlights the main product flows represented in the showcase screenshots.

## 1. Personalized home

The home screen gives the user a context-aware daily recommendation rather than a static dashboard. The recommendation can incorporate current conditions and learned wardrobe preferences, while still allowing the user to request another option or continue editing the look.

**Screenshot:** `assets/screenshots/home-mobile.png`

## 2. Digital closet

The closet is the structured source of truth for wardrobe items. Users can search, filter, refine incomplete metadata, and inspect availability across the wardrobe.

This structured item model is what makes later recommendation logic possible: SET reasons about category, color, material, fit, comfort, temperature behavior, occasion, and styling metadata rather than treating an item as only an image.

**Screenshot:** `assets/screenshots/closet-mobile.png`

## 3. Adding and enriching an item

Adding an item is a guided multi-step flow. The first required information is intentionally small, while richer metadata can be progressively added.

The comfort and weather step captures information that feeds the recommendation engine instead of remaining purely descriptive UI data.

**Screenshot:** `assets/screenshots/add-item-mobile.png`

## 4. Dress Me recommendations

Dress Me is the main recommendation surface. The user can choose an occasion and receive ranked looks using the wardrobe already stored in SET.

The recommendation pipeline combines hard outfit-structure constraints with occasion, styling coherence, practicality, weather suitability, and confidence-aware personalization. Individual pieces can be swapped without rebuilding the entire look manually.

**Screenshot:** `assets/screenshots/dress-me-mobile.png`

## 5. Saved outfits

The desktop Outfits view demonstrates that the product is responsive rather than a mobile-only prototype. Saved combinations can be reviewed, searched, and reused as part of the wider wardrobe workflow.

**Screenshot:** `assets/screenshots/outfits-desktop.png`

## 6. Travel / suitcase mode

Travel mode creates a trip-scoped wardrobe from the user's main closet. Once a suitcase is selected, recommendation flows can operate on the packed subset rather than the entire wardrobe.

This is an example of a product requirement that affects both UX and domain logic: the same recommendation rules remain reusable, while the eligible inventory is constrained by travel context.

**Screenshot:** `assets/screenshots/suitcase-desktop.png`

## Product principles visible in the UI

- **Mobile-first, responsive implementation** — the same product system adapts between bottom navigation on mobile and a persistent sidebar on desktop.
- **Progressive disclosure** — complex wardrobe metadata is split into guided steps instead of one long form.
- **Explainable context** — occasion and weather context are visible to the user rather than hidden inside a black-box recommendation.
- **Reusable domain rules** — outfit validity, weather reasoning, and recommendation logic live outside individual screens.
- **Product continuity** — closet → recommendations → saved outfits → planning → travel all operate on the same structured wardrobe model.

> SET is actively under development. Screenshots represent the product at a specific development snapshot and may evolve as the UI, recommendation engine, and security model continue to improve.
