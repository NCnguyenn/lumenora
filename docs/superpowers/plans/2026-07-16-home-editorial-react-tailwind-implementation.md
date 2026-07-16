# Lumenora Home Editorial React/Tailwind Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the existing React/Tailwind Home implementation so the running `/` route matches the approved Editorial Magazine v5 mockup, ships its editorial imagery, and preserves all six existing routes.

**Architecture:** Keep the current shared router, store, Header, and Footer behavior. Complete the already-present Home editorial composition rather than replacing it, copy the staged image set with corrected semantic mapping, and add Vitest/React Testing Library coverage for the approved content flow, route safety, closing-note semantics, and asset availability.

**Tech Stack:** React 19, TypeScript 6, React Router 7, Tailwind CSS 3, Vite 8, Vitest, React Testing Library, Lucide React.

## Global Constraints

- Source of truth: `docs/superpowers/specs/2026-07-16-home-editorial-magazine-v5-design.md` and `Mockups/home-editorial-magazine-v5.png`.
- Preserve the existing Hero carousel content and behavior.
- Do not create routes beyond `/`, `/shop`, `/quiz`, `/blog`, `/wishlist`, and `/cart`.
- Category, product, and ritual links point to `/shop`; journal links point to `/blog`.
- Do not display chapter numbers, section numbers, numbered ritual labels, trust strips, or repeated ecommerce card grids.
- Preserve all unrelated user changes and all existing mockups.
- Use `npm.cmd` on Windows because PowerShell blocks `npm.ps1`.

---

### Task 1: Add Home UI Test Infrastructure and RED Tests

**Files:**
- Modify: `Frontend/package.json`
- Modify: `Frontend/package-lock.json`
- Modify: `Frontend/vite.config.ts`
- Create: `Frontend/src/test/setup.ts`
- Create: `Frontend/src/pages/Home.test.tsx`

**Interfaces:**
- Consumes: `Home`, `MemoryRouter`, public image paths.
- Produces: `npm.cmd run test` and a regression suite for the Home editorial flow.

- [ ] **Step 1: Install the test-only dependencies**

Run from `Frontend`:

```powershell
npm.cmd install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

Expected: package files add the four dev dependencies without changing runtime dependencies.

- [ ] **Step 2: Configure Vitest**

Add a `test` script to `package.json`:

```json
"test": "vitest run"
```

Extend `vite.config.ts` with a jsdom test environment and setup file:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 3: Write the failing Home tests**

Create `src/pages/Home.test.tsx` with tests that:

```tsx
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { Home } from './Home'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

const editorialAssets = [
  'home-contents-skin.jpg',
  'home-contents-body.jpg',
  'home-contents-sun.jpg',
  'home-daily-edit.jpg',
  'home-composition-serum.jpg',
  'home-composition-mask.jpg',
  'home-composition-sunscreen.jpg',
  'home-brand-interlude.jpg',
  'home-ritual-cleanse.jpg',
  'home-ritual-treat.jpg',
  'home-ritual-protect.jpg',
  'home-journal-primary.jpg',
]

describe('Home editorial experience', () => {
  it('renders the approved editorial passages and safe destinations', () => {
    const { container } = renderHome()
    expect(screen.getByText('Compositions for the Skin')).toBeInTheDocument()
    expect(screen.getByText('Many formulas.')).toBeInTheDocument()
    expect(screen.getByText('Cleanse. Treat. Protect.')).toBeInTheDocument()
    expect(screen.getByText('The Lumenora Journal')).toBeInTheDocument()

    const allowed = new Set(['/shop', '/blog'])
    container.querySelectorAll('a[href]').forEach((link) => {
      expect(allowed.has(link.getAttribute('href') ?? '')).toBe(true)
    })
  })

  it('exposes the newsletter as the dark closing editorial note', () => {
    renderHome()
    const note = screen.getByRole('region', { name: 'Notes from the Beauty Desk' })
    expect(note).toHaveClass('bg-charcoal', 'text-ivory')
    expect(within(note).getByRole('button', { name: 'Subscribe' })).toBeInTheDocument()
  })

  it('ships every editorial image used by Home', () => {
    editorialAssets.forEach((filename) => {
      const path = resolve(process.cwd(), 'public', 'assets', 'generated', filename)
      expect(existsSync(path), `${filename} should exist`).toBe(true)
      expect(statSync(path).size, `${filename} should be non-empty`).toBeGreaterThan(100_000)
    })
  })
})
```

- [ ] **Step 4: Run the suite and verify RED**

Run:

```powershell
npm.cmd run test -- src/pages/Home.test.tsx
```

Expected: failure because the newsletter is not yet a labelled dark region and the 12 editorial JPGs are absent.

### Task 2: Correct and Integrate the Editorial Image Set

**Files:**
- Modify: `copy-home-editorial-images.ps1`
- Create: `Frontend/public/assets/generated/home-contents-skin.jpg`
- Create: `Frontend/public/assets/generated/home-contents-body.jpg`
- Create: `Frontend/public/assets/generated/home-contents-sun.jpg`
- Create: `Frontend/public/assets/generated/home-daily-edit.jpg`
- Create: `Frontend/public/assets/generated/home-composition-serum.jpg`
- Create: `Frontend/public/assets/generated/home-composition-mask.jpg`
- Create: `Frontend/public/assets/generated/home-composition-sunscreen.jpg`
- Create: `Frontend/public/assets/generated/home-brand-interlude.jpg`
- Create: `Frontend/public/assets/generated/home-ritual-cleanse.jpg`
- Create: `Frontend/public/assets/generated/home-ritual-treat.jpg`
- Create: `Frontend/public/assets/generated/home-ritual-protect.jpg`
- Create: `Frontend/public/assets/generated/home-journal-primary.jpg`

**Interfaces:**
- Consumes: twelve staged JPG files already present on the machine.
- Produces: the exact public paths consumed by `Home.tsx` and `assetManifest.ts`.

- [ ] **Step 1: Fix the two swapped mapping pairs**

In `copy-home-editorial-images.ps1`, use this exact mapping:

```powershell
$map = [ordered]@{
  "1.jpg"  = "home-contents-skin.jpg"
  "3.jpg"  = "home-contents-body.jpg"
  "2.jpg"  = "home-contents-sun.jpg"
  "4.jpg"  = "home-brand-interlude.jpg"
  "5.jpg"  = "home-composition-sunscreen.jpg"
  "6.jpg"  = "home-composition-mask.jpg"
  "7.jpg"  = "home-daily-edit.jpg"
  "8.jpg"  = "home-ritual-treat.jpg"
  "10.jpg" = "home-ritual-protect.jpg"
  "9.jpg"  = "home-journal-primary.jpg"
  "11.jpg" = "home-ritual-cleanse.jpg"
  "12.jpg" = "home-composition-serum.jpg"
}
```

- [ ] **Step 2: Run the inspected copy script**

Run from the workspace root:

```powershell
powershell.exe -ExecutionPolicy Bypass -File .\copy-home-editorial-images.ps1
```

Expected: twelve files copied, each larger than 100 KB, and `_copy-home-images-result.json` generated.

- [ ] **Step 3: Re-run the asset test**

Run:

```powershell
npm.cmd run test -- src/pages/Home.test.tsx
```

Expected: the asset test passes; the closing-note test remains red until Task 3.

### Task 3: Match the Closing Region and Polish Home Semantics

**Files:**
- Modify: `Frontend/src/pages/Home.tsx`
- Modify: `Frontend/src/components/layout/Footer.tsx`
- Modify: `Frontend/index.html`

**Interfaces:**
- Consumes: approved mockup and existing shared Footer.
- Produces: a dark, labelled closing note flowing into the existing charcoal Footer, correct copyright text, and Lumenora document metadata.

- [ ] **Step 1: Convert the newsletter into a labelled dark closing note**

Change the final Home section to:

```tsx
<section
  aria-label="Notes from the Beauty Desk"
  className="bg-charcoal text-ivory border-b border-ivory/15"
>
```

Update the descendants in that section from charcoal/brass colors to ivory variants while keeping the existing field and submit behavior:

```text
eyebrow: text-ivory/50
heading: text-ivory
supporting copy: text-ivory/60
form rule: border-ivory/25
label: text-ivory/45
input: text-ivory placeholder:text-ivory/30
button: text-ivory hover:text-parchment
```

- [ ] **Step 2: Correct footer and document copy**

In `Footer.tsx`, use the literal:

```tsx
© 2026 LUMENORA. ALL RIGHTS RESERVED.
```

In `index.html`, set:

```html
<title>Lumenora</title>
<meta name="description" content="Premium botanical skincare, crafted with intention." />
```

- [ ] **Step 3: Run the Home test and verify GREEN**

Run:

```powershell
npm.cmd run test -- src/pages/Home.test.tsx
```

Expected: all Home editorial tests pass.

### Task 4: Full Verification and Visual QA

**Files:**
- Verify: `Frontend/src/pages/Home.tsx`
- Verify: `Frontend/public/assets/generated/*.jpg`
- Verify: `Frontend/dist/`

**Interfaces:**
- Consumes: completed implementation.
- Produces: tested production bundle and a visually reviewed Home route.

- [ ] **Step 1: Run all automated checks**

Run from `Frontend`:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: all commands exit 0 without errors.

- [ ] **Step 2: Start the Vite app**

Run:

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

Expected: Vite serves the app locally and `/` loads with no failed local image requests.

- [ ] **Step 3: Review desktop and mobile behavior**

Verify against the mockup:

```text
[ ] Existing Hero carousel remains intact.
[ ] Skin/Body/Sun collage is asymmetric and readable.
[ ] Daily Edit has one dominant image and ruled product list.
[ ] Composition image ratios differ visibly.
[ ] Oxblood brand interlude breaks the page rhythm.
[ ] Cleanse/Treat/Protect alternate image and copy positions.
[ ] Journal shows one dominant and two supporting stories.
[ ] Closing note and Footer form one continuous dark ending.
[ ] No chapter numbers or new routes appear.
[ ] At mobile width, every section stacks without horizontal overflow.
```

- [ ] **Step 4: Re-run build after any visual correction**

Run:

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Expected: all three commands still exit 0.
