# Design System: High-End Editorial Luxury

## 1. Overview & Creative North Star
**The Creative North Star: "The Modern Curator"**

This design system is built to transform a digital interface into a curated, high-end editorial experience. Rather than a standard e-commerce grid, we treat the screen as a series of physical layers—fine Egyptian papyrus, polished limestone, and handcrafted gold leaf.

The aesthetic identity centers on **Intentional Asymmetry**. By breaking the rigid 12-column expectations of the web, we create a "soulful" rhythm. We utilize "Bento" style containers with mixed-proportions, floating overlaid cards, and full-bleed lifestyle photography to evoke the feeling of a premium physical lookbook.

**Key Differentiator:** We do not use structural lines to separate thoughts. We use space, tonal shifts, and typography as structural elements.

---

## 2. Colors & Surface Philosophy
The palette is rooted in warmth. We strictly prohibit "Cool Grays" or "Pure Black" (outside of the footer). All neutrals are tinted with organic warmth to reflect the Egyptian sun and desert sands.

### Color Tokens
* **Primary Background:** `#fff8f1` (Surface) — The base of the experience.
* **Gold Accent:** `#7a5900` (Primary) / `#b88e2f` (Primary Container) — Used for focus and heritage.
* **Text/Ink:** `#1e1b15` (On Surface) — A deep, warm charcoal.
* **Footer/Foundation:** `#1a1a18` (Inverse Surface) — The only grounding dark element.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.**
* **Boundaries:** Use background color shifts (e.g., a `surface-container-low` section sitting on a `surface` background).
* **Hierarchy:** Use the `spacing-16` or `spacing-20` tokens to create "voids" that act as invisible dividers.

### Surface Nesting
Treat the UI as physical layers.
* **Level 0:** `surface` (Base)
* **Level 1:** `surface-container-low` (Subtle inset for background sections)
* **Level 2:** `surface-container-lowest` (The "Pure White" card: `#ffffff`. Used for floating elements to create a crisp, handcrafted lift).

---

## 3. Typography
Typography is not just for reading; it is a primary design element. Large-scale serifs should overlap imagery to create depth.

* **Display & Headlines (Cormorant Garamond):**
* *Role:* Editorial soul. Use `display-lg` (3.5rem) for hero statements.
* *Styling:* Light weight, tight line-height (1.1). Use for product names and storytelling.
* **Navigation & CTAs (Montserrat):**
* *Role:* Modern utility.
* *Styling:* Light weight, All-Caps, wide tracking (0.15em). This provides the "luxury boutique" signage feel.
* **Body (Inter):**
* *Role:* Readability.
* *Styling:* `body-md` (0.875rem) for descriptions. High line-height (1.6) for an airy, premium feel.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** and **Ambient Shadows**, never through heavy outlines.

* **The Layering Principle:** Place a `surface-container-lowest` (#FFFFFF) card on a `surface-container-low` section. This creates a soft, natural "step" in the UI.
* **Ambient Shadows:** For floating lifestyle cards, use a shadow that mimics natural light:
* *Value:* `0px 20px 40px rgba(30, 27, 21, 0.05)`.
* *Note:* The shadow color must be a tint of the `on-surface` color (#1E1B15), not a neutral gray.
* **The "Ghost Border" Fallback:** If a container requires definition against a complex image, use `outline-variant` at **15% opacity**.
* **Glassmorphism:** For navigation bars or mobile overlays, use `surface-bright` at 80% opacity with a `20px` backdrop blur to allow the warmth of the photography to bleed through.

---

## 5. Components

### Bento Grid Cards
* **Radius:** Always `rounded-sm` (4px). Luxury is sharp, not bubbly.
* **Layout:** Mix `1x1`, `2x1`, and `2x2` sizes in a single section.
* **Interaction:** On hover, a subtle tonal shift from `surface-container-low` to `surface-container-highest`.

### Buttons
* **Primary:** Background `#b88e2f`, Text `#ffffff`. Montserrat Light, Uppercase. Padding `1.2rem 2.75rem`.
* **Secondary (Editorial):** Ghost style. No background. Border is `outline-variant` at 20% opacity.
* **Transition:** All buttons use a 400ms "slow" ease-in-out to mimic the brand's unhurried, handcrafted nature.

### Inputs & Fields
* **Style:** Underline only. No box containers.
* **Bottom Border:** `outline-variant` (1px).
* **Active State:** Transitions to `primary` (#7a5900) with a 2px weight.

### Editorial Overlays
* **Usage:** Place a `body-sm` text card (Montserrat, wide tracking) partially overlapping a full-bleed photo.
* **Background:** Use `surface-container-lowest` (#FFFFFF) with a 4px radius and an Ambient Shadow.

---

## 6. Do's and Don'ts

### Do
* **DO** use whitespace as a luxury commodity. If a section feels crowded, double the spacing token (e.g., move from `10` to `20`).
* **DO** crop photography in asymmetrical ratios (e.g., a tall 4:7 next to a wide 16:9).
* **DO** use typography as a decorative background element (e.g., a low-opacity large serif letter behind a chair).

### Don't
* **DON'T** use 100% opaque black borders or dividers. This "kills" the soulful, airy atmosphere.
* **DON'T** use gradients. Professionalism in this system comes from flat, confident planes of warm color.
* **DON'T** use rounded corners larger than 8px. Large radii feel "techy" or "juvenile"; 4px feels "architectural."
* **DON'T** use standard "Center-Aligned" layouts for everything. Offset your headings to the left or right to create a professional editorial flow.