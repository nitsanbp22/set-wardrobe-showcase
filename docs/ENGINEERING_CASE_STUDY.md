# Engineering Case Study

This document highlights several engineering decisions behind SET that are useful to discuss in a technical interview.

## 1. Structural correctness before ranking

### Problem
A recommendation system can produce a visually plausible score for an outfit that is structurally invalid — for example, a dress combined with trousers and a primary top.

### Decision
SET separates **hard invariants** from **soft scoring**.

Candidates must first satisfy canonical outfit rules. Only valid candidates reach the styling and personalization layers.

### Why it matters
This prevents high scores in one dimension, such as color compatibility, from compensating for an impossible outfit structure.

It also gives the product a single source of truth shared by recommendation generation and manual outfit-building flows.

---

## 2. Bounded candidate generation instead of brute force

### Problem
If every wardrobe item could be combined with every other item, candidate count grows quickly and most combinations are meaningless.

### Decision
The generator works from outfit templates such as:

- top + bottom + shoes;
- one-piece + shoes;
- valid layered separates;
- optional accessory enrichment.

### Why it matters
The search space stays manageable, results are easier to reason about, and structural validation remains explicit.

This also makes it easier to apply occasion-aware ordering without turning the system into an opaque combinatorial search.

---

## 3. Context-specific scoring weights

### Problem
A single global scoring formula does not represent the meaning of a “good outfit” across different situations.

### Decision
SET changes the relative importance of scoring dimensions by occasion.

Examples:

- **Wedding / event:** occasion fit, formality and footwear are dominant.
- **Travel:** practicality, weather, comfort and footwear matter more.
- **Everyday:** practicality, weather, comfort and general styling coherence are emphasized.

### Why it matters
The system models the user’s intent rather than treating every outfit as the same optimization problem.

---

## 4. Confidence-aware personalization

### Problem
A personalization system can overfit quickly when a user has saved only a small number of outfits.

### Decision
Personal preferences are applied as a refinement layer whose influence grows with evidence confidence.

The profile can learn patterns such as:

- preferred silhouette combinations;
- footwear pairings;
- category combinations;
- color and palette tendencies;
- formality preferences;
- recurring item pairs;
- style anchors.

### Why it matters
General styling logic remains stable for new users while the experience becomes more individual as evidence accumulates.

---

## 5. Missing metadata affects confidence, not validity

### Problem
Real wardrobes contain incomplete data. Treating every missing attribute as a rejection condition would make recommendations brittle.

### Decision
Missing metadata generally lowers confidence rather than automatically declaring an outfit incompatible.

### Why it matters
The system can continue generating useful results while encouraging richer metadata over time.

---

## 6. Diversity as a ranking requirement

### Problem
A pure top-score ranking often collapses onto a small number of garments, showing nearly identical outfits repeatedly.

### Decision
After scoring and quality filtering, SET applies diversity-aware ranking with penalties for repeated garments and repeated outfit structures.

### Why it matters
The recommendation surface helps the user discover more of their wardrobe instead of repeatedly reinforcing the same few pieces.

---

## 7. Weather as a separate domain concern

### Problem
Temperature alone is not enough to decide whether an outfit is appropriate.

### Decision
SET’s thermal logic considers factors such as:

- current / feels-like temperature;
- a later temperature drop;
- wind;
- rain;
- indoor vs. outdoor context;
- activity level;
- personal temperature sensitivity;
- garment category, material and layering.

The system can return a tri-state layer recommendation: **required**, **recommended**, or **not needed**.

### Why it matters
Weather reasoning remains independent from general styling coherence and can evolve without rewriting the recommendation engine.

---

## 8. Separate production and portfolio surfaces

The production application remains in a private repository. This showcase is intentionally separate and has a fresh history.

This allows selected engineering work to be discussed publicly without exposing:

- credentials;
- administrative tooling;
- user data;
- deployment internals;
- private product implementation details that are unnecessary for an interview.

The separation also means portfolio presentation changes cannot affect the live application.
