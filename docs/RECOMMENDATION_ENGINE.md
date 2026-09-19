# Recommendation Engine

SET treats outfit generation as a constrained ranking problem rather than random combinatorics.

## Pipeline

```text
Wardrobe + context
  ↓
Normalize direct request constraints
  ↓
Filter explicit exclusions
  ↓
Candidate generation
  ↓
Hard structural validation
  ↓
Styling + context scoring
  ↓
Confidence-aware personalization
  ↓
Preferred quality threshold
  ↓
Best-valid fallback for sparse closets
  ↓
Session-aware diversity ranking
```

## 1. Direct request constraints

Recommendation context can come from structured product controls or from the conversational Stylist.

Current development inputs can include:

- occasion;
- silhouette;
- preferred or exact color families;
- minimum comfort level;
- whether an extra layer is wanted;
- activity level;
- indoor / mixed / outdoor environment;
- explicit excluded garment or material keywords.

Requested colors are normalized before scoring. Explicit exclusions are applied before candidate generation so the system does not waste ranking capacity on looks the user already rejected.

## 2. Candidate generation

Candidates are created from bounded outfit templates such as:

- top + bottom + shoes;
- one-piece + shoes;
- valid layered variants;
- accessory-enriched variants.

The generator deliberately avoids brute-forcing every possible subset of the wardrobe. This keeps generation predictable and makes structural correctness easier to enforce.

## 3. Hard constraints before scoring

A candidate must satisfy canonical outfit invariants before it can be ranked. Examples include:

- one-piece garments are mutually exclusive with bottoms and primary tops;
- separates require a valid top + bottom core;
- only physically plausible top-on-top layering is allowed;
- slot cardinality is limited for shoes, bags, bottoms, and primary outerwear;
- complete recommendations require footwear.

A structurally invalid outfit cannot survive because it received a strong color, personalization, or occasion score.

## 4. Multi-dimensional scoring

Each valid candidate can be evaluated across:

- occasion suitability;
- formality;
- color compatibility;
- silhouette balance;
- material compatibility;
- pattern balance;
- footwear suitability;
- bag suitability;
- layering;
- practicality;
- comfort;
- weather suitability;
- negative styling rules.

Weights vary by context. A wedding, everyday request, travel scenario, or high-activity day should not optimize the same dimensions identically.

## 5. Personalization

Personalization is a refinement layer, not a replacement for general outfit quality.

Evidence can include:

- silhouette pairings;
- footwear pairings;
- category combinations;
- color mood and palette;
- formality tier;
- materials;
- individual-item affinity;
- repeated item pairs;
- style anchors;
- saved, rated, built, and worn looks.

Personal evidence is confidence-weighted so early behavior does not overfit the system.

## 6. Preferred threshold with graceful fallback

The engine prefers candidates above a configured recommendation threshold.

However, a sparse or incomplete wardrobe should not automatically create an empty screen. If no valid candidates clear the preferred threshold, the current generator can use the best-scoring valid pool as a fallback and still apply diversity before returning results.

This is a product tradeoff: preserve structural validity while degrading recommendation confidence more gracefully.

## 7. Session-aware diversity

A pure score sort tends to repeat the same high-performing garments across consecutive requests.

The engine therefore tracks signals such as:

- previously shown outfit signatures;
- item usage within the current recommendation session;
- repeated outfit structures.

Diversity penalties are applied while preserving relevance. This helps SET surface more of the wardrobe instead of returning small variations on the same look.

## 8. Conversational Stylist integration

The Stylist does not generate free-form clothing descriptions. It translates natural language into the same structured recommendation context used by the rest of SET.

```text
Message → intent schema → recommendation context → valid wardrobe candidates
```

The interpretation layer is bounded and sanitized. An external model can be used when configured, while a deterministic parser provides a fallback.

This keeps the AI-assisted experience connected to inspectable product logic rather than replacing it.
