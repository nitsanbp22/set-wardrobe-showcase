# Recommendation Engine

SET treats outfit generation as a constrained ranking problem rather than random combinatorics.

## Pipeline

```text
Context
  ↓
Candidate generation
  ↓
Hard structural validation
  ↓
Styling + context scoring
  ↓
Personalization
  ↓
Quality threshold
  ↓
Diversity-aware ranking
```

## 1. Candidate generation

Candidates are created from bounded outfit templates such as:

- top + bottom + shoes;
- one-piece + shoes;
- valid layered variants;
- accessory-enriched variants.

The generator deliberately avoids brute-forcing every possible subset of the wardrobe. This keeps generation predictable and makes structural correctness easier to enforce.

## 2. Hard constraints before scoring

A candidate must satisfy canonical outfit invariants before it can be ranked. Examples include:

- one-piece garments are mutually exclusive with bottoms and primary tops;
- separates require a valid top + bottom core;
- only physically plausible top-on-top layering is allowed;
- slot cardinality is limited for shoes, bags and outerwear.

This separation is important: a structurally invalid outfit should never survive because it happened to receive a strong color or occasion score.

## 3. Multi-dimensional scoring

Each valid candidate is evaluated across multiple dimensions. The production system includes signals for:

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

The relative weight of these signals changes by context. A wedding recommendation emphasizes occasion, formality and footwear more strongly, while travel emphasizes practicality, comfort and weather.

## 4. Personalization

Personalization is a refinement layer, not a replacement for general outfit quality. The engine can learn evidence around:

- silhouette pairings;
- footwear pairings;
- category combinations;
- color mood and palette;
- formality tier;
- materials;
- individual-item affinity;
- repeated item pairs;
- style anchors.

Personal evidence is confidence-weighted so a small number of observations cannot dominate the engine prematurely.

## 5. Quality gate

Candidates below a configurable recommendation threshold are removed before the final ranking stage.

Missing metadata reduces confidence but does not automatically make an item incompatible. This prevents sparse wardrobe data from becoming an accidental hard rejection rule.

## 6. Diversity-aware ranking

A recommendation batch should not repeatedly show the same garments with only a minor accessory changed.

The final ranking therefore applies diversity penalties to repeated garments and repeated structures while still preserving high-quality results.

This makes the recommendation surface useful as a wardrobe-discovery tool rather than simply returning the highest-scoring few pieces again and again.
