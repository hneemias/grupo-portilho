# Design System Document: High-End Editorial for Grupo Portilho

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Precision Pastoral."** 

This is not a generic industrial framework. It is an editorial approach that marries the raw power of agribusiness with the surgical precision of global logistics. We move beyond "blue for trust" and "green for nature" by embracing a sophisticated, layered experience that feels like a high-end architectural journal. 

The layout breaks the traditional grid through intentional asymmetry—text that overlaps large-scale high-definition imagery and content blocks that shift vertically to create a sense of kinetic movement. We are building an experience that feels as vast as a farm field and as efficient as a modern warehouse.

## 2. Colors: Tonal Depth & Modernity
The palette is rooted in the deep blue and vibrant green of the Grupo Portilho logo, but refined into a Material 3 ecosystem that emphasizes "Air" and "Soil."

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. In this design system, boundaries are created through the transition of surface tiers. To separate a testimonial section from a hero section, shift from `surface` (#fff8f5) to `surface-container-low` (#fff1e8). This creates a premium, seamless flow that mimics the horizons of the natural world.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials.
- **Base Layer:** `surface` (#fff8f5)
- **Nested Content:** Use `surface-container-lowest` (#ffffff) for cards to create a subtle "lift" against a `surface-container-low` (#fff1e8) background.
- **High-Impact Areas:** Use `surface-container-highest` (#f3dfd0) to anchor intense logistical data or complex forms.

### The "Glass & Gradient" Rule
To elevate the brand above its competitors, utilize **Glassmorphism** for navigation bars and floating interaction panels. Use `surface` colors at 70% opacity with a `20px` backdrop-blur. 
*Signature Polish:* CTAs should not be flat. Apply a subtle linear gradient from `primary` (#002d79) to `primary_container` (#1d4498) at a 135-degree angle to give buttons a tactile, "engine-pressed" finish.

---

## 3. Typography: The Editorial Voice
Our typography scale creates an authoritative yet approachable hierarchy.

- **Display & Headlines:** **Plus Jakarta Sans.** This typeface conveys modern precision. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines to command attention.
- **Body & Labels:** **Inter.** Chosen for its extreme legibility in technical logistics data. 
- **The Identity Mix:** By pairing the geometric strength of Plus Jakarta Sans with the neutral clarity of Inter, we reflect the brand's dual nature: the vision of a "Group" and the daily reality of "Logistics."

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too heavy for a modern agribusiness brand. We define depth through light and tone.

- **The Layering Principle:** Avoid shadows for static content. Use the `surface-container` tokens to "step" the depth. A `surface-container-low` card sitting on a `surface` background provides all the separation needed for a high-end look.
- **Ambient Shadows:** For interactive floating elements (e.g., a "Track Shipment" modal), use an ultra-diffused shadow: `0px 24px 48px rgba(36, 26, 17, 0.06)`. The tint is derived from the `on_surface` (#241a11) to ensure the shadow looks like natural ambient light, not digital noise.
- **The "Ghost Border":** If a border is required for a form field, use `outline_variant` (#c4c6d3) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (0.75rem) corner radius. Use `on_primary` (#ffffff) for text.
- **Secondary:** Semi-transparent `secondary_container` (#b4f566) with a subtle `2px` blur behind it.
- **Tertiary:** No background. Bold `primary` (#002d79) text with a small, animated green arrow from the `secondary` (#3f6900) palette.

### Input Fields
- **Style:** Understated. Use `surface_container_lowest` (#ffffff) background with a "Ghost Border" that transitions to a `2px` `primary` (#002d79) bottom-only border on focus.
- **Typography:** Labels use `label-md` in `on_surface_variant` (#444652).

### Cards & Data Lists
- **Forbid Dividers:** Do not use horizontal lines between list items. Instead, use `16px` of vertical white space or alternating backgrounds between `surface` and `surface-container-low`.
- **Imagery:** Cards should feature full-bleed imagery related to trucks, soil, or warehouses, with text overlays using the Glassmorphism technique described in Section 2.

### Logistics Progress Tracker (New Component)
- A bespoke component for tracking shipments. Use a thick `secondary_fixed` (#b4f566) line to represent the path, with `primary` (#002d79) nodes. Use `headline-sm` for the "Current Location" to emphasize real-time movement.

---

## 6. Do's and Don'ts

### Do:
- **Do** use large, high-resolution imagery of textures (grain, tire treads, furrowed soil) as background accents.
- **Do** use "Plus Jakarta Sans" for all numbers in data visualizations; the geometric curves feel technical and precise.
- **Do** embrace white space. If a section feels crowded, double the padding. Premium brands breathe.

### Don't:
- **Don't** use standard 1px borders. If you feel the need to separate, use a color shift.
- **Don't** use pure black (#000000). Use `on_surface` (#241a11) for all "black" text to maintain a warm, organic feel.
- **Don't** use "default" system icons. Use a custom, thin-stroke icon set (1.5px weight) that matches the precision of the typography.