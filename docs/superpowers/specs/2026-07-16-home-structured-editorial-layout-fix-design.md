# Lumenora Home — Structured Editorial Layout Fix

## Objective

Repair the uneven visual density visible in the current Home implementation while preserving the approved botanical editorial direction, existing Hero, imagery, content, colors, and six-route navigation model.

## Confirmed Root Causes

- The category collage places all three items in the same desktop grid row with large offsets and self-alignment, producing accidental overlap and unclear reading order.
- The product composition sequence combines a narrow `5/12` figure, a large left offset, and `112px` vertical spacing, leaving desktop-sized dead zones.
- Descriptive copy and prices frequently use low-opacity charcoal and very small type, reducing legibility on ivory and parchment backgrounds.

## Approved Direction

Use a structured asymmetric grid: editorial, but anchored to clear columns and predictable caption positions.

### Categories

- Keep Skin as the dominant portrait.
- Place Body and Sun in a stable right-hand composition without overlapping the images.
- Add readable category names, one-line descriptions, and a consistent Explore cue.
- Stack naturally on small screens.

### Product Compositions

- Keep the serum panorama as a full-width lead.
- Place the mask and sunscreen in one balanced desktop spread with different widths but aligned vertical rhythm.
- Keep product name, descriptor, and price directly connected to each image.
- Remove empty zones caused by narrow isolated figures and oversized section gaps.

### Typography and Motion

- Body copy must use at least `text-sm` with charcoal opacity no lower than 70%; primary descriptions use `text-base` where space permits.
- Product titles remain serif and increase to `text-lg` or larger.
- Add restrained scroll reveal, image zoom, overlay tint, and animated underline treatments.
- Respect `prefers-reduced-motion`; no new animation dependency is permitted.

## Scope Constraints

- Modify only the existing Home presentation and shared global CSS required by its motion treatment.
- Preserve the current Hero content and behavior.
- Preserve all existing routes and link destinations.
- Do not generate or add new image assets.
- Do not add new sections.

## Acceptance Criteria

- Categories no longer overlap at desktop widths and maintain a clear Skin → Body → Sun reading order.
- The mask and sunscreen compositions share a cohesive spread with no large unintended blank region.
- Product names, descriptions, prices, and section introductions are visibly higher contrast.
- Interactive imagery has subtle hover feedback; sections reveal softly where supported.
- Reduced-motion users receive a static experience.
- Existing Home tests, lint, and production build pass.
