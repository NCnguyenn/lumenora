# Home Structured Editorial Layout Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove accidental whitespace and overlap from Home while improving text clarity and adding restrained editorial motion.

**Architecture:** Keep `Home.tsx` as the existing page composition and change only the category and product-composition grids. Add progressive-enhancement motion utilities to `index.css`; layout remains fully usable without animation support.

**Tech Stack:** React 19, TypeScript, React Router, Tailwind CSS 3, Vitest, Testing Library.

## Global Constraints

- Preserve the existing Hero, images, content order, palette, and routes.
- Do not add packages, routes, sections, or image assets.
- Respect `prefers-reduced-motion`.

---

### Task 1: Add layout and readability regressions

**Files:**
- Modify: `Frontend/src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: rendered `Home` page.
- Produces: stable section landmarks `home-categories` and `home-compositions`, plus readable editorial class markers.

- [ ] **Step 1: Write the failing tests**

```tsx
it('uses structured grids for categories and product compositions', () => {
  const { container } = renderHome()
  expect(container.querySelector('[data-layout="home-categories"]')).toHaveClass('lg:grid-cols-12')
  expect(container.querySelector('[data-layout="home-compositions"]')).toHaveClass('md:grid-cols-12')
})

it('marks editorial passages for progressive motion', () => {
  const { container } = renderHome()
  expect(container.querySelectorAll('.editorial-reveal').length).toBeGreaterThan(3)
})
```

- [ ] **Step 2: Run test to verify RED**

Run: `npm.cmd run test -- Home.test.tsx`

Expected: FAIL because the structured layout hooks do not exist yet.

### Task 2: Rebuild categories and product composition rhythm

**Files:**
- Modify: `Frontend/src/pages/Home.tsx`
- Test: `Frontend/src/pages/Home.test.tsx`

**Interfaces:**
- Produces: `data-layout="home-categories"`, `data-layout="home-compositions"`, and `.editorial-reveal` page sections.

- [ ] **Step 1: Replace overlapping category placement**

Use a twelve-column desktop parent. Skin occupies columns 1–5; a right-hand seven-column area contains Body and Sun in a stable nested grid. Each link owns its caption, description, and Explore cue.

- [ ] **Step 2: Replace isolated composition figures**

Keep the lead panorama, then render mask and sunscreen inside one twelve-column spread with `md:col-span-5` and `md:col-span-6 md:col-start-7` placement.

- [ ] **Step 3: Improve copy contrast**

Use `text-charcoal/70` or stronger for supporting copy and `text-charcoal/80` or stronger for prices and captions.

- [ ] **Step 4: Run focused tests**

Run: `npm.cmd run test -- Home.test.tsx`

Expected: all Home tests PASS.

### Task 3: Add progressive editorial motion and verify

**Files:**
- Modify: `Frontend/src/index.css`
- Modify: `Frontend/src/pages/Home.tsx`

**Interfaces:**
- Consumes: `.editorial-reveal`, `.editorial-image`, and `.editorial-link` classes.
- Produces: CSS-only motion with reduced-motion fallback.

- [ ] **Step 1: Add motion utilities**

```css
.editorial-image { transition: transform 900ms cubic-bezier(.2,.75,.25,1), filter 500ms ease; }
.group:hover .editorial-image { transform: scale(1.025); filter: saturate(1.04) contrast(1.02); }
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .editorial-reveal { animation: editorial-reveal both linear; animation-timeline: view(); animation-range: entry 4% cover 28%; }
  }
}
```

- [ ] **Step 2: Apply motion hooks to editorial passages**

Add `.editorial-reveal` to content groups, `.editorial-image` to interactive imagery, and `.editorial-link` to text CTAs.

- [ ] **Step 3: Run complete verification**

Run: `npm.cmd run test`

Expected: all tests PASS.

Run: `npm.cmd run lint`

Expected: exit code 0.

Run: `npm.cmd run build`

Expected: exit code 0 and a generated `dist` bundle.

- [ ] **Step 4: Perform visual QA**

Inspect desktop and mobile renders. Confirm no overlap, no isolated product with a viewport-sized blank region, readable captions, stable mobile stacking, and subtle motion behavior.
