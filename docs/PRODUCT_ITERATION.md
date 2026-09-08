# SET — Product iteration: from feedback to acceptance criteria

**Updated:** September 8, 2026  
**Scope:** Product and UX requirements discussed September 5–8, 2026.

This case study records the latest product direction and the checks needed to demonstrate it. It does not claim that all changes have shipped. The private implementation was unavailable during this documentation refresh, so the existing code samples and screenshots have not been revalidated or replaced.

## 1. Manual outfit building

**Feedback:** Selecting an outfit should feel like browsing clothing pieces together, with direct control over each category.

**Product direction:** Provide independent scrolling through tops, bottoms, and shoes. Let the user enable an optional jacket category. Preserve compatible selections while another category changes.

**Acceptance criteria:**

- Changing the top preserves the chosen bottom and shoes.
- Enabling the jacket slot allows browsing outerwear; disabling it removes that optional selection from the resulting look.
- A dress or one-piece replaces the top-and-bottom base. It can be paired with shoes, a bag, appropriate jewelry, and an optional jacket.
- Saved outfits match the visible selection.
- The selection flow works on mobile and desktop, including Hebrew RTL.

This direction makes individual choices easier while retaining the structural rules already represented in the showcase.

## 2. Card spacing and control alignment

**Feedback:** Tags and buttons remain too close to their enclosing borders, and the relationship between text, controls, and card dimensions feels unbalanced.

**Product direction:** Treat card padding, control spacing, and text wrapping as a shared layout concern across viewport sizes.

**Acceptance criteria:**

- Cards retain visible internal padding on all sides.
- Wrapped tags and long Hebrew labels stay inside the padded content area.
- Buttons remain clearly separated from neighboring text and the card border.
- Mobile and desktop layouts preserve a consistent spacing hierarchy.
- Controls remain readable and usable without clipping or overlap.

No completed visual fix is claimed until the affected screens have been reviewed.

## 3. Recommendation precision

**Feedback:** Some generated looks combine a dress with separates; occasion categories overlap too much; weather and learned preferences need more consistent influence.

| Requirement | Intended behavior | Acceptance example |
| --- | --- | --- |
| Dress exclusivity | A one-piece serves as the complete base | No primary top or trousers alongside a dress |
| Occasion boundaries | Distinguish wedding and evening suitability from everyday clothing | Casual jeans and a T-shirt do not become a wedding look through color matching alone |
| Elegant items in everyday looks | Allow suitable elegant garments in everyday combinations; do not assume the reverse | An elegant item may work casually when the rest of the look supports it |
| Weather and layers | Evaluate outfit warmth and whether an extra layer is useful | A jacket is considered when conditions warrant it |
| Personalization | Use the user's saved and created looks as preference evidence | Learned patterns refine ranking while outfit validity remains mandatory |

These criteria describe what the current iteration should verify. The existing [recommendation overview](RECOMMENDATION_ENGINE.md) and selected code samples document the earlier engineering snapshot.

## 4. Home-screen usefulness and loading

**Feedback:** The home screen should offer more relevant information, and loading and outfit-generation transitions should feel smoother.

**Product direction:** Prioritize useful daily wardrobe actions and investigate the delays users encounter during the main flows.

**Proposed verification:**

- Review whether the home screen helps the user take a useful next action.
- Measure home, closet, and outfit-generation timings before and after changes under the same conditions.
- Check visible feedback while loading or generating, including empty and error states.
- Confirm that changed preferences produce the corresponding results and that previous results are not mistaken for the new selection.

No speed improvement, benchmark, or user-impact metric is asserted in this refresh.

## Evidence and refresh status

| Material | Status on September 8, 2026 |
| --- | --- |
| Latest product requirements | Captured in this document |
| README and walkthrough | Updated to link this iteration |
| Selected code samples | Retained from the existing showcase; no new production comparison |
| Screenshots | Retained from the existing showcase; not evidence of the proposed selector or spacing fixes |
| Production tests and security review | Not run as part of this documentation refresh |

A future implementation refresh should compare the current private source, review the selected modules for publication, and replace screenshots only after checking the updated experience.

## Interview discussion

This iteration illustrates the connection between product feedback and implementation criteria: identify the user's friction, define the expected behavior, preserve domain constraints, and specify how completion will be checked. It also separates a design decision from evidence that the change works.
