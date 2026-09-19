# SET — Product iteration: verified development snapshot

**Updated:** September 19, 2026  
**Scope:** Current web development branch, dedicated mobile branch, and the public showcase documentation.

This document replaces the earlier September 8 requirements-only snapshot with a verification-oriented view of the current development work. It still does **not** claim that every item below has been released to the public production branch or app stores.

## 1. Conversational SET Stylist

### Current development behavior

A user can describe a styling need in natural language and receive looks generated from their actual wardrobe.

The current flow can interpret constraints such as:

- occasion;
- silhouette;
- comfort;
- preferred colors;
- exact-color intent;
- whether an extra layer is wanted;
- activity level;
- indoor / outdoor context;
- explicit exclusions such as jeans or heels.

The server interpretation endpoint requires an authenticated user session.

### AI boundary

When a Gemini API key is configured, the endpoint can use the model to translate the message into a bounded intent schema. The response is sanitized before use.

If the model is unavailable, invalid, too slow, or not configured, SET falls back to deterministic parsing.

The external model does not choose arbitrary garments. The final looks are still created by SET's recommendation engine from wardrobe items that actually belong to the user.

## 2. Recommendation generation refinements

The current development generator includes additional handling for:

- normalized requested color families;
- explicit excluded keywords;
- current-session item reuse;
- current-session structure reuse;
- previously shown signatures;
- a best-valid fallback pool when no candidate clears the preferred minimum score.

These changes address a recurring product issue: recommendation systems can otherwise become repetitive or fail too aggressively when wardrobe data is sparse.

## 3. Daily recommendation and planner

The current development comparison also includes changes to:

- home daily recommendation logic;
- planner ranking for saved outfits;
- wear-history statistics used by product flows.

The public showcase documents these as active development areas rather than claiming a measured improvement that has not been benchmarked publicly.

## 4. Dedicated mobile client

The mobile development branch contains a separate React/Vite/Capacitor client.

Verified mobile work includes:

- a dedicated SET Stylist screen;
- reuse of shared recommendation logic;
- authenticated calls to the Stylist interpretation endpoint;
- mobile weather context;
- a package configuration containing Capacitor Camera, Geolocation, Haptics, and Local Notifications.

This is a development implementation snapshot, not a statement that iOS or Android store distribution is complete.

## 5. Web / mobile parity principle

The goal is not pixel-for-pixel identity. Web and mobile can have different interaction patterns while preserving the same product semantics:

- the same outfit validity rules;
- the same recommendation context;
- the same personalization model;
- the same weather logic;
- the same interpretation of user constraints.

## 6. What remains intentionally cautious in this showcase

| Area | Showcase wording |
| --- | --- |
| AI Stylist | Implemented in current development branches |
| Gemini integration | Optional intent interpretation with deterministic fallback |
| Mobile app | Dedicated Capacitor client in active development |
| Screenshots | Earlier visual snapshot; not evidence of every current feature |
| Performance | No public benchmark claim |
| App-store release | Not claimed |
| Production-main parity | Not claimed |

## Interview discussion

This iteration is useful because it demonstrates how a product can add AI without handing core product behavior to the model:

1. define a bounded language-understanding task;
2. sanitize the result into known product state;
3. preserve deterministic domain rules;
4. design a fallback path;
5. reuse the same domain across web and mobile;
6. verify what is actually implemented before presenting it publicly.
