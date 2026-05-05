---
version: "alpha"
name: "Krishnapal Sendhav | Senior Software Engineer"
description: "Krishnapal Sendhav is a results-driven software developer with expertise in Flutter, backend development, and modern application architecture. He has contributed to multiple production applications and continues to build innovative digital products with a focus on usability, scalability, and quality engineering."
colors:
  primary: "#00F0FF"
  secondary: "#FFFFFF"
  tertiary: "#0A45FF"
  neutral: "#FFFFFF"
  background: "#FFFFFF"
  surface: "#171717"
  text-primary: "#A3A3A3"
  text-secondary: "#FFFFFF"
  border: "#FFFFFF"
  accent: "#00F0FF"
typography:
  display-lg:
    fontFamily: "Cinzel"
    fontSize: "128px"
    fontWeight: 300
    lineHeight: "128px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Manrope"
    fontSize: "14px"
    fontWeight: 200
    lineHeight: "20px"
    letterSpacing: "0.025em"
  label-md:
    fontFamily: "Manrope"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "3px"
    textTransform: "uppercase"
rounded:
  md: "0px"
spacing:
  base: "16px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "40px"
  gap: "8px"
  section-padding: "40px"
components:
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "16px"
  button-link:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Flex
  - Content Width: Bounded
  - Framing: Glassy
  - Grid: Minimal

## Colors

The color system uses dark mode with #00F0FF as the main accent and #FFFFFF as the neutral foundation.

- **Primary (#00F0FF):** Main accent and emphasis color.
- **Secondary (#FFFFFF):** Supporting accent for secondary emphasis.
- **Tertiary (#0A45FF):** Reserved accent for supporting contrast moments.
- **Neutral (#FFFFFF):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #171717; Text Primary: #A3A3A3; Text Secondary: #FFFFFF; Border: #FFFFFF; Accent: #00F0FF

- **Gradients:** bg-gradient-to-t from-neutral-900/90 to-transparent via-neutral-900/20, bg-gradient-to-b from-white to-neutral-500, bg-gradient-to-t from-white/10 to-transparent

## Typography

Typography pairs Cinzel for display hierarchy with Manrope for supporting content and interface copy.

- **Display (`display-lg`):** Cinzel, 128px, weight 300, line-height 128px, letter-spacing -0.025em.
- **Body (`body-md`):** Manrope, 14px, weight 200, line-height 20px, letter-spacing 0.025em.
- **Labels (`label-md`):** Manrope, 12px, weight 400, line-height 16px, letter-spacing 3px, uppercase.

## Layout

Layout follows a flex composition with reusable spacing tokens. Preserve the flex, bounded structural frame before changing ornament or component styling. Use 16px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a flex / bounded composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Flex
- **Content width:** Bounded
- **Base unit:** 16px
- **Scale:** 16px, 24px, 32px, 40px, 48px
- **Section padding:** 40px
- **Gaps:** 8px, 16px, 24px, 32px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #FFFFFF; 1px #262626
- **Blur:** 4px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 0px padding and a 0px radius. Drive the shell with linear-gradient(to top, rgba(23, 23, 23, 0.9), rgba(23, 23, 23, 0.2), rgba(0, 0, 0, 0)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 9999px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Secondary:** background #FFFFFF, text #FFFFFF, radius 0px, padding 16px, border 1px solid rgba(255, 255, 255, 0.2).
- **Links:** text #A3A3A3, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 16px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms and 500ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and stroke changes. Scroll choreography uses Parallax for section reveals and pacing.

**Motion Level:** moderate

**Durations:** 150ms, 500ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** text, stroke, color, shadow

**Scroll Patterns:** parallax

## WebGL

Reconstruct the graphics as a inset 3d accent using webgl, renderer, antialias, dpr clamp. The effect should read as retro-futurist, technical, and meditative: perspective grid field with green on black and sparse spacing. Build it from grid lines + depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Inset 3D accent
  - **Effect:**
    - **Value:** Perspective grid field
  - **Primitives:**
    - **Value:** Grid lines + depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** WebGL, Renderer, antialias, DPR clamp

**Techniques:** Perspective grid, Breathing pulse, Pointer parallax, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL Canvas -->
      <canvas id="webgl-canvas" class="fixed inset-0 z-0 outline-none"></canvas>

      <!-- Scrim Overlay -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
      }

      import * as THREE from 'three';
      import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
      import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
      …
      ```
  - **Scene setup:**
    - **Language:** js
    - **Snippet:**
      ```json
      {
        "imports": {
          "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
      }
      ```

## ThreeJS

Reconstruct the Three.js layer as a inset 3d accent that feels retro-futurist and technical. Use antialias, tone mapping, dpr clamp renderer settings, perspective, ~45deg fov, box geometry, meshphysicalmaterial materials, and directional + spot lighting. Motion should read as timeline-led reveals, with poster frame + dom fallback.

**Id:** threejs

**Label:** ThreeJS

**Stack:** ThreeJS, WebGL

**Insights:**
  - **Scene:**
    - **Value:** Inset 3D accent
  - **Render:**
    - **Value:** antialias, tone mapping, DPR clamp
  - **Camera:**
    - **Value:** Perspective, ~45deg FOV
  - **Lighting:**
    - **Value:** directional + spot
  - **Materials:**
    - **Value:** MeshPhysicalMaterial
  - **Geometry:**
    - **Value:** box
  - **Motion:**
    - **Value:** Timeline-led reveals

**Techniques:** PBR shading, Bloom shaping, Timeline beats, antialias, tone mapping, DPR clamp, Poster frame + DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- WebGL Canvas -->
      <canvas id="webgl-canvas" class="fixed inset-0 z-0 outline-none"></canvas>

      <!-- Scrim Overlay -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
      }

      import * as THREE from 'three';
      import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
      import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
      …
      ```
  - **Scene setup:**
    - **Language:** js
    - **Snippet:**
      ```json
      {
        "imports": {
          "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
      }
      ```
