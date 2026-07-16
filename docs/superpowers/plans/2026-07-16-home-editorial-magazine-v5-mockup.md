# Lumenora Home Editorial Magazine v5 Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce one new full-page Home mockup that preserves the current Hero and rebuilds everything below it as an asymmetric art-magazine commerce flow with original luxury product photography.

**Architecture:** Use the existing Hero image and v4 mockup only as visual references, then generate a fresh integrated webpage composition rather than editing the repeated v4 grid. Validate the generated raster visually against the approved v5 specification, make at most one focused correction pass if required, and copy the accepted result into `Mockups/` without overwriting prior work.

**Tech Stack:** Built-in image generation, local image inspection, PowerShell file and raster validation.

## Global Constraints

- Source of truth: `docs/superpowers/specs/2026-07-16-home-editorial-magazine-v5-design.md`.
- Preserve the existing first Hero slide and its exact approved copy.
- Do not display chapter numbers, section numbers, or numbered ritual labels.
- Do not use repeated equal-width ecommerce card grids below the Hero.
- Use only destinations supported by Home, Shop, Quiz, Blog, Wishlist, and Cart.
- Generate original Lumenora product photography; do not reproduce Aesop or Violet Grey packaging, layouts, assets, or copy.
- Final file: `Mockups/home-editorial-magazine-v5.png`.
- Preserve every existing file in `Mockups/`.

---

### Task 1: Prepare the Reference Set and Generation Brief

**Files:**
- Read: `docs/superpowers/specs/2026-07-16-home-editorial-magazine-v5-design.md`
- Read: `Frontend/src/pages/Home.tsx`
- Reference: `Frontend/public/assets/generated/hero-1.png`
- Reference: `Mockups/home-botanical-editorial-full-v4.png`

**Interfaces:**
- Consumes: approved v5 specification, current Hero asset, previous full-page mockup.
- Produces: one structured image-generation prompt with explicit invariants and exact interface copy.

- [ ] **Step 1: Inspect both raster references before generation**

Use the local image viewer on:

```text
D:\Personal_Project\Lumenora\Frontend\public\assets\generated\hero-1.png
D:\Personal_Project\Lumenora\Mockups\home-botanical-editorial-full-v4.png
```

Expected: the first image establishes the exact Hero imagery; the second establishes the Lumenora wordmark/header context while also showing the equal-grid structure that must not be inherited.

- [ ] **Step 2: Build the final generation brief from the specification**

The prompt must explicitly define:

```text
Use case: ui-mockup
Asset type: high-fidelity full-page desktop Home mockup
Primary request: generate a fresh Lumenora art-magazine ecommerce page, preserving the referenced current Hero and rebuilding all passages below it.
Reference roles: hero-1.png is a strict Hero image/content reference; v4 is only a brand/header reference and its below-Hero layout must be discarded.
Composition: straight-on 1440 px design-width webpage, asymmetric twelve-column editorial grid, varied panorama/square/portrait crops, narrow copy columns, folio captions, hairline rules, purposeful negative space.
Required flow: compact Header; unchanged current Hero; staggered SKIN/BODY/SUN contents; THE DAILY EDIT; COMPOSITIONS FOR THE SKIN; oxblood brand interlude; alternating CLEANSE/TREAT/PROTECT ritual scenes; THE LUMENORA JOURNAL; editor-note newsletter; charcoal Footer.
Photography: original 4K-style luxury product still-life using wet limestone, amber and frosted glass, ivory tubes, cream jars, water, oxidized brass, mineral surfaces, botanical shadows, realistic contact shadows, optical depth, and subtle grain.
Typography: high-contrast editorial serif plus restrained uppercase sans-serif utility text.
Palette: #E8E0D2, #F4F0E8, #181713, #6B1F2B, #69705A, #8A7452.
Constraints: no chapter numbers; no 01/02/03 labels; no equal card rows; no trust strip; no pills; no rounded containers; no copied packaging; no fake routes; no browser chrome; no device frame; no watermark.
```

Expected: the prompt carries every visual invariant needed to distinguish v5 from v4.

### Task 2: Generate the Integrated Full-Page Mockup

**Files:**
- Create: `Mockups/home-editorial-magazine-v5.png`
- Preserve: `Mockups/home-botanical-editorial-full-v4.png`
- Preserve: `Mockups/home-botanical-editorial-full-v3.png`
- Preserve: `Mockups/home.png`

**Interfaces:**
- Consumes: structured prompt and two inspected visual references from Task 1.
- Produces: one generated full-page PNG copied into the workspace.

- [ ] **Step 1: Generate one fresh full-page composition**

Call the built-in image generator once with the approved prompt and these references:

```text
Frontend/public/assets/generated/hero-1.png
Mockups/home-botanical-editorial-full-v4.png
```

Expected: one tall, straight-on webpage mockup with a recognizable preserved Hero and a newly composed asymmetric editorial page beneath it.

- [ ] **Step 2: Copy the generated PNG into the project**

Resolve the PNG path from the generator output and copy it to:

```text
D:\Personal_Project\Lumenora\Mockups\home-editorial-magazine-v5.png
```

Expected: destination exists, is a non-empty PNG, and no earlier mockup is modified.

- [ ] **Step 3: Verify the saved raster mechanically**

Run:

```powershell
$path = 'D:\Personal_Project\Lumenora\Mockups\home-editorial-magazine-v5.png'
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($path)
try {
  [PSCustomObject]@{
    Exists = Test-Path $path
    Width = $img.Width
    Height = $img.Height
    Bytes = (Get-Item $path).Length
    Portrait = $img.Height -gt $img.Width
  }
} finally {
  $img.Dispose()
}
```

Expected: `Exists=True`, `Bytes>0`, and `Portrait=True`.

### Task 3: Visual Acceptance Review and One Focused Correction

**Files:**
- Inspect: `Mockups/home-editorial-magazine-v5.png`
- Optionally replace only after correction: `Mockups/home-editorial-magazine-v5.png`

**Interfaces:**
- Consumes: saved mockup from Task 2 and all acceptance criteria in the v5 specification.
- Produces: visually accepted final mockup.

- [ ] **Step 1: Inspect the saved PNG at high detail**

Use the local image viewer and check every item below:

```text
[ ] Header and existing Summer Edit Hero are recognizable.
[ ] No visible chapter or section numbers.
[ ] SKIN, BODY, and SUN form a staggered collage, not three equal tiles.
[ ] The Daily Edit uses a dominant still-life plus narrow product list.
[ ] Product compositions vary between panorama, square, and portrait ratios.
[ ] Brand interlude is sparse and oxblood-led.
[ ] CLEANSE, TREAT, and PROTECT alternate down the page without equal columns.
[ ] Journal has one dominant story and two supporting stories without cards.
[ ] Newsletter reads like a closing editorial note and transitions into a charcoal footer.
[ ] Product photography looks physically grounded, coherent, original, and premium.
[ ] No unsupported routes, trust claims, copied logos, browser frame, or watermark.
```

Expected: all structural criteria are visibly satisfied; tiny generated label microtext is ignored only when the authoritative product name and price are legible outside the image.

- [ ] **Step 2: Apply one correction pass only if a material criterion fails**

Use the first generated mockup as the edit target and repeat all invariants while naming only the failed criterion. Examples:

```text
Change only the below-Hero layout: remove the remaining equal product-card row and replace it with one panoramic still-life plus a narrow caption column. Keep the Header, Hero, palette, all other passages, and page dimensions unchanged.
```

or

```text
Change only the ritual passage: remove visible 01/02/03 labels and stagger CLEANSE, TREAT, and PROTECT vertically with alternating image and text placement. Keep every other part unchanged.
```

Expected: the corrected result fixes the named structural issue without changing the preserved Hero or introducing new sections.

- [ ] **Step 3: Re-run raster validation after any replacement**

Repeat the PowerShell validation from Task 2 and inspect the final PNG once more.

Expected: the final workspace file is a non-empty portrait PNG and satisfies the visual checklist.

### Task 4: Delivery Record

**Files:**
- Verify: `Mockups/home-editorial-magazine-v5.png`

**Interfaces:**
- Consumes: visually accepted and mechanically valid PNG.
- Produces: final user-facing handoff with the saved path, generation mode, and reference roles.

- [ ] **Step 1: Confirm non-destructive output**

Run:

```powershell
Get-Item 'Mockups\home.png', 'Mockups\home-botanical-editorial-full-v3.png', 'Mockups\home-botanical-editorial-full-v4.png', 'Mockups\home-editorial-magazine-v5.png' |
  Select-Object Name, Length, LastWriteTime
```

Expected: all four files exist and the v5 path is distinct.

- [ ] **Step 2: Present the generated image and its workspace location**

Report:

```text
Final asset: D:\Personal_Project\Lumenora\Mockups\home-editorial-magazine-v5.png
Mode: built-in image generation
Strict reference: current hero-1.png
Brand-only reference: previous v4 mockup
```

Expected: the user can review the integrated full-page mockup directly in the conversation and in the workspace.
