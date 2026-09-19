# SET — AI Stylist

## Product goal

The SET Stylist lets a user describe what they need in normal language while keeping the result grounded in their actual wardrobe and the same recommendation rules used elsewhere in the product.

The design goal is **not** “ask an LLM to style the user.” It is:

1. understand the user's request;
2. convert it into explicit product constraints;
3. generate valid outfits from real wardrobe data;
4. preserve personalization, weather, and diversity logic.

## Architecture

```text
User message
   ↓
Authenticated interpretation endpoint
   ↓
Gemini when configured
   ↓
Sanitized StylistIntent
   ↘
     deterministic parser fallback
             ↓
Shared recommendation context
             ↓
SET recommendation engine
             ↓
Looks from the user's wardrobe
```

## Bounded intent schema

The current intent model can represent:

- occasion;
- silhouette;
- minimum comfort level;
- preferred or exact color families;
- extra-layer preference;
- activity level;
- mostly indoor / mixed / mostly outdoor environment;
- explicit excluded keywords;
- confidence;
- source: AI or deterministic parser.

Only approved taxonomy values are accepted after interpretation.

## Why sanitize model output?

External model output is untrusted input.

The server validates the result against SET's allowed values before it becomes recommendation state. Unsupported colors, exclusions, or enum values are discarded instead of silently entering the product.

## Deterministic fallback

The same flow can parse common Hebrew and English requests without an external model.

Examples include recognizing:

- wedding, work, dinner, night out, travel, studies, beach, or everyday context;
- black, white, grey, beige, blue, red, and other canonical color families;
- fitted or relaxed silhouette requests;
- comfort language;
- requests for or against a jacket/layer;
- exclusions such as jeans, heels, dresses, skirts, sneakers, shorts, leggings, blazers, leather, or crop items.

The fallback is intentionally narrower than a language model, but it keeps the feature useful and predictable.

## Separation of responsibilities

### Language layer
Understands phrasing and returns structured constraints.

### Recommendation domain
Owns:

- wardrobe eligibility;
- outfit validity;
- occasion scoring;
- color and styling coherence;
- comfort;
- weather;
- personalization;
- diversity.

This separation prevents the language model from inventing garments or bypassing product rules.

## Shared web and mobile behavior

The web Stylist and mobile Stylist both feed the shared recommendation engine.

The mobile client calls the authenticated interpretation endpoint and can fall back locally to deterministic parsing. The resulting intent is then combined with mobile weather context, user style data, and wardrobe items.

## Security and privacy boundary

The public showcase does not include provider API keys, environment files, user data, or service-role credentials.

The interpretation endpoint requires authentication before processing requests.

## Product tradeoffs

- A very broad free-form agent would be more flexible but harder to test and keep grounded.
- A deterministic form-only experience would be easier to control but would not offer the same conversational convenience.
- SET uses a hybrid design: natural language at the edge, structured product state in the core.

That makes the AI feature additive rather than foundational to system correctness.
