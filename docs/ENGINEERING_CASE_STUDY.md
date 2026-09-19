# Engineering Case Study

This document highlights engineering and product-system decisions behind SET that are useful to discuss in a technical or product interview.

## 1. Structural correctness before ranking

### Problem
A recommendation system can assign a visually plausible score to an outfit that is structurally invalid — for example, a dress combined with trousers and a primary top.

### Decision
SET separates **hard invariants** from **soft scoring**. Candidates must satisfy canonical outfit rules before reaching styling and personalization.

### Why it matters
A high score in one dimension cannot compensate for an impossible outfit structure, and the same validator can be reused across manual building and recommendation flows.

---

## 2. Bounded candidate generation instead of brute force

### Problem
Combining every item with every other item creates a rapidly growing search space where most combinations are meaningless.

### Decision
The generator uses outfit templates such as top + bottom + shoes, one-piece + shoes, valid layered separates, and optional accessory enrichment.

### Why it matters
The search space stays manageable, results are easier to reason about, and occasion-aware ordering remains inspectable.

---

## 3. Context-specific scoring

### Problem
A single global definition of a “good outfit” does not represent every situation.

### Decision
SET changes the relative importance of recommendation dimensions by context.

Examples:

- **Wedding / event:** occasion fit, formality, and footwear matter strongly.
- **Travel:** practicality, weather, comfort, and footwear gain importance.
- **Everyday:** practicality, weather, comfort, wardrobe rotation, and general styling coherence are emphasized.

### Why it matters
The system models the user's intent rather than treating all outfits as the same optimization problem.

---

## 4. Confidence-aware personalization

### Problem
A personalization system can overfit quickly when a user has saved only a small number of outfits.

### Decision
Personal preferences refine the baseline score, and their influence grows with evidence confidence.

### Why it matters
General styling logic remains stable for new users while the product becomes more individual as evidence accumulates.

---

## 5. Missing metadata affects confidence, not automatic validity

### Problem
Real wardrobes contain incomplete metadata.

### Decision
Missing information generally reduces confidence rather than automatically rejecting an item or outfit.

### Why it matters
The system remains useful while data quality improves over time.

---

## 6. Diversity is a ranking requirement

### Problem
A pure top-score ranking repeatedly returns the same garments.

### Decision
SET tracks previous signatures, item reuse, and structure reuse within a session and applies diversity-aware ranking.

### Why it matters
The product helps users discover more of their wardrobe rather than reinforcing a narrow subset.

---

## 7. Weather is a separate domain concern

### Problem
Temperature alone is not enough to decide whether an outfit is practical.

### Decision
Thermal reasoning can consider temperature, feels-like temperature, later temperature drops, wind, rain, indoor/outdoor context, activity, user sensitivity, garment type, material, and layering.

The result can distinguish **layer required**, **layer recommended**, and **layer not needed**.

### Why it matters
Weather logic can evolve independently of general styling coherence.

---

## 8. Natural language becomes bounded product state

### Problem
A conversational styling feature can become unreliable if an LLM is allowed to invent clothes, make unrestricted styling decisions, or bypass product rules.

### Decision
The SET Stylist uses a narrow intent schema. The interpretation layer can extract:

- occasion;
- silhouette;
- comfort floor;
- color preferences;
- layer preference;
- activity;
- environment;
- explicit exclusions.

The result is sanitized before it enters recommendation logic.

### Why it matters
The language model handles language. The product domain still handles outfits.

That boundary makes the feature easier to test, debug, and explain.

---

## 9. External AI is optional, not a single point of failure

### Problem
External model latency, quotas, configuration, or provider failure should not make the core styling flow unusable.

### Decision
The authenticated interpretation endpoint uses Gemini when configured and falls back to deterministic parsing when it is unavailable or returns invalid output.

### Why it matters
The user still receives a functional styling path, and the application retains predictable baseline behavior.

---

## 10. Shared domain logic across web and mobile

### Problem
A separate mobile application can easily drift into a second implementation of the same product rules.

### Decision
The Capacitor mobile client owns mobile-specific UI and device integrations while reusing the recommendation domain.

### Why it matters
Dress rules, personalization, diversity, and weather behavior can remain consistent across surfaces.

---

## 11. Sparse-closet fallback without weakening invariants

### Problem
A strict score threshold can create an empty recommendation experience for small or incomplete wardrobes.

### Decision
SET first prefers candidates above the configured quality threshold. If none qualify, it can take the best-scoring valid pool and still apply diversity.

### Why it matters
The system degrades recommendation confidence before it degrades structural correctness.

---

## 12. Separate production and portfolio surfaces

The production application remains private. This showcase is intentionally separate and has a curated history.

This allows selected work to be discussed publicly without exposing credentials, administrative tooling, user data, deployment internals, or unnecessary private implementation details.

Portfolio updates therefore cannot modify the live application.
