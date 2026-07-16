# Lumenora Home Full-Page v4 Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Edit the accepted v3 Home mockup into a more balanced nine-block v4 with image-led Categories, a trust strip, and Shop the Ritual.

**Architecture:** Treat v3 as the edit target, use the user-provided Categories image only as a layout reference, and use three local product images as supporting references for Shop the Ritual. Preserve the approved visual system and existing Hero, remove the redundant Featured Product block, and save the accepted edit as a new PNG.

**Tech Stack:** Built-in OpenAI image editing, local PNG references, Codex image inspection, PowerShell file validation.

## Global Constraints

- Edit target: `Mockups/home-botanical-editorial-full-v3.png`.
- Output: `Mockups/home-botanical-editorial-full-v4.png`.
- Preserve v3 and all earlier mockups.
- Nine-block order: Header → existing Hero → Categories with Trust Strip → New & Noteworthy → Best Sellers → Shop the Ritual → Why Lumenora → The Lumenora Journal → Newsletter with Footer.
- Preserve the current Hero and its Summer Edit copy.
- Remove the v3 Featured Product block completely.
- Visible destinations remain limited to Home, Shop, Quiz, Blog, Wishlist, and Cart.

---

### Task 1: Edit, validate, and persist v4

**Files:**
- Read: `docs/superpowers/specs/2026-07-16-home-full-page-botanical-editorial-design.md`
- Edit target: `Mockups/home-botanical-editorial-full-v3.png`
- Style reference: `C:\Users\CHINGU~1\AppData\Local\Temp\codex-clipboard-afffe031-fe30-494e-8a4d-d3a6e7317986.png`
- Supporting reference: `Frontend/public/assets/generated/product-cleanser.png`
- Supporting reference: `Frontend/public/assets/generated/product-serum.png`
- Supporting reference: `Frontend/public/assets/generated/product-sunscreen.png`
- Create: `Mockups/home-botanical-editorial-full-v4.png`

**Interfaces:**
- Consumes: v3 UI composition, approved v4 spec, Categories layout reference, three project product images.
- Produces: one non-destructive v4 PNG for user review.

- [ ] **Step 1: Confirm all five image inputs are readable**

Use these roles exactly:

```text
Image 1: edit target — preserve its Header, Summer Edit Hero, Botanical Editorial palette, product-card language, Why Lumenora, Journal, Newsletter, and Footer styling.
Image 2: layout reference only — use its three-image Categories row and compact trust-strip idea; do not copy its photos or policy claims.
Image 3: supporting Cleanse product reference for Shop the Ritual.
Image 4: supporting Treat product reference for Shop the Ritual.
Image 5: supporting Protect product reference for Shop the Ritual.
```

- [ ] **Step 2: Generate the v4 edit**

Use built-in image editing with this prompt:

```text
Use case: ui-mockup
Asset type: high-fidelity tall desktop website Home page mockup edit
Input images: Image 1 is the edit target. Image 2 is only a structural reference for Categories and the trust strip. Images 3–5 are supporting product references for Cleanse, Treat, and Protect.
Primary request: Edit Image 1 into LUMENORA Home v4. Preserve its visual identity, Header, existing Summer Edit Hero, New & Noteworthy styling, Best Sellers styling, Why Lumenora, Journal, Newsletter, and Footer. Change the page structure to exactly nine blocks.
Change 1: immediately below Hero insert one combined Category Discovery block. Top row has three equal image tiles labeled "SKINCARE", "BODYCARE", "SUNCARE", with original luxury skincare imagery and dark bottom gradients. Beneath them, within the same visual block, add a compact four-column trust strip with monochrome line icons: "CONSIDERED SELECTION" / "Curated Products"; "GUIDED DISCOVERY" / "Skin Quiz"; "EXPERT EDITORIAL" / "Informed Routines"; "SEAMLESS BASKET" / "One Checkout". Use Image 2 only for layout inspiration. Do not copy its photos or shipping/returns claims.
Change 2: remove the entire Featured Product / Body Lotion Lavender Patchouli split block from Image 1.
Change 3: immediately after Best Sellers insert a pale-olive "SHOP THE RITUAL" block with three equal tall editorial columns. Column 1: "01 CLEANSE", using Image 3's product language, products "Green Tea Deep Cleansing — $25.00" and "Eucalyptus Nourishing Body Cleanser — $34.00". Column 2: "02 TREAT", using Image 4's product language, products "Advanced Snail Mucin 96% Power Repairing Essence Serum — $18.50" and "Mugwort Calming Cream — $38.50". Column 3: "03 PROTECT", using Image 5's product language, products "Invisible Fluid Sunscreen SPF 50+ PA++++ — $24.80" and "Body Lotion Lavender Patchouli — $42.00". Each column ends with "EXPLORE THE RITUAL".
Change 4: visually join Newsletter and Footer into one continuous charcoal closing region while preserving their existing content.
Exact order: Header → existing Summer Edit Hero → Categories with Trust Strip → New & Noteworthy → Best Sellers → Shop the Ritual → Why Lumenora → The Lumenora Journal → Newsletter with Footer.
Color palette: preserve parchment #E8E0D2, ivory #F4F0E8, charcoal #181713, burgundy #6B1F2B, olive #69705A.
Constraints: change only the requested structure and additions; preserve the current Hero and v3 art direction; no Featured Product block; no extra sections; no free-shipping or return claims; no new routes; no About, Contact, FAQ, Profile, Login, Checkout, Sustainability, Shipping, Account, or Privacy links; no device frame, perspective, watermark, third-party logos, copied reference photography, or gibberish filler text.
```

- [ ] **Step 3: Validate v4**

Accept only if:

```text
1. The page has exactly the nine approved blocks in order.
2. Header and Summer Edit Hero remain recognizably consistent with v3.
3. Categories and the four-item trust strip form one combined block directly below Hero.
4. Featured Product is absent.
5. Shop the Ritual appears directly after Best Sellers with Cleanse, Treat, Protect columns.
6. Why Lumenora, Journal, Newsletter, and Footer remain present.
7. No unsupported policy claim or unavailable route appears.
8. The page remains a coherent tall desktop webpage, not a collage.
```

- [ ] **Step 4: Save and verify**

Copy the accepted built-in output to `D:\Personal_Project\Lumenora\Mockups\home-botanical-editorial-full-v4.png`. Confirm it is a readable, non-empty PNG and is not byte-identical to v3.
