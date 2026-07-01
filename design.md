# Kotoba Quest — Kawaii Design System

> A complete design reference for the Kotoba Quest Japanese vocabulary learning RPG.
> Inspired by Sanrio, Japanese stationery, and kawaii culture.
> "Everything should feel like it could be hugged."

---

## 1. Visual Theme & Atmosphere

### Mood
Warm, friendly, playful, inviting — like walking into a Sanrio store or opening a beautiful Japanese stationery journal. The UI should feel soft, safe, and encouraging for learners.

### Design Philosophy
- **Rounded Everything**: No sharp edges. Every corner is soft, every shape is approachable.
- **Gentle Feedback**: Correct answers feel like confetti, wrong answers feel like a gentle nudge — never harsh.
- **Cute Decorations**: Sparkles (✦), stars (★), small hearts (♡), soft gradient backgrounds. Used sparingly as accents, never overwhelming.
- **Cozy Atmosphere**: The app should feel like a warm cup of matcha — comforting and pleasant to spend time in.

### Density
Airy and spacious. Generous whitespace between elements. Nothing feels cramped or cluttered. Minimum 1.5rem spacing between major sections.

### Visual Language
| Element | Kawaii Approach | Cyberpunk (Old) |
|---------|----------------|-----------------|
| Corners | 16-24px radius, pill shapes | 12px radius |
| Shadows | Soft, diffused, colored | Hard, dark, neon glow |
| Borders | 1-2px, subtle, warm-toned | 1-2px, neon glow |
| Text | Mixed case, friendly | ALL CAPS, aggressive |
| Effects | Sparkles, stars, soft gradients | Scanlines, CRT, neon glow |
| Surfaces | Solid colors, subtle gradients | Glassmorphism, blur |

---

## 2. Color Palette & Roles

### Light Mode (Primary)

| Semantic Name | Color Name | Hex | Role |
|---------------|-----------|-----|------|
| `--bg-primary` | Sakura Cream | `#FFF8F5` | Page background, warm cream with pink tint |
| `--bg-surface` | Blossom White | `#FFFFFF` | Cards, panels, elevated surfaces |
| `--bg-surface-alt` | Petal Pink | `#FFF0F3` | Hover states, secondary surfaces, input backgrounds |
| `--main` | Sakura Pink | `#FF8FAB` | Primary actions, brand color, links |
| `--main-light` | Soft Pink | `#FFD1DC` | Hover states, selected indicators, light fills |
| `--secondary` | Wisteria | `#B8A9C9` | Secondary actions, decorative accents |
| `--accent` | Matcha Green | `#A8E6CF` | Success states, correct answers, positive feedback |
| `--warning` | Yuzu Yellow | `#FFD97D` | Warnings, mid-health, caution states |
| `--danger` | Ume Red | `#FF6B8A` | Errors, damage, low health, defeat |
| `--text-primary` | Sumi Ink | `#4A3728` | Main body text (warm brown, NOT pure black) |
| `--text-secondary` | Fude Gray | `#8B7E74` | Secondary text, captions, hints |
| `--border` | Soft Line | `#F0E6E0` | Subtle borders, dividers |

### Dark Mode

| Semantic Name | Color Name | Hex | Role |
|---------------|-----------|-----|------|
| `--bg-primary` | Night Indigo | `#1A1525` | Page background, deep purple-charcoal |
| `--bg-surface` | Twilight Plum | `#2D2640` | Cards, panels |
| `--bg-surface-alt` | Dusk Mauve | `#3A3252` | Hover states, secondary surfaces |
| `--main` | Neon Sakura | `#FFB3C6` | Primary actions (brighter for dark bg) |
| `--main-light` | Glow Pink | `#FFD1DC` | Hover, selected |
| `--secondary` | Star Wisteria | `#C8B6E2` | Secondary actions |
| `--accent` | Neon Matcha | `#B8F0D8` | Success, correct answers |
| `--warning` | Neon Yuzu | `#FFE5A0` | Warnings |
| `--danger` | Neon Ume | `#FF8FA3` | Errors, damage |
| `--text-primary` | Moon White | `#F0E6F0` | Main text (warm white, NOT pure white) |
| `--text-secondary` | Cloud Gray | `#A89BA8` | Secondary text |
| `--border` | Night Line | `#3D3555` | Subtle borders |

### Color Usage Rules
- **Backgrounds**: Always use `--bg-primary` or `--bg-surface`. Never pure black or pure white.
- **Text**: Always use `--text-primary` or `--text-secondary`. Never pure black (#000) or pure white (#FFF).
- **Primary actions**: Use `--main` for buttons, links, active states.
- **Success**: Use `--accent` for correct answers, completed states, positive feedback.
- **Danger**: Use `--danger` for errors, damage, wrong answers.
- **Warnings**: Use `--warning` for caution states, mid-health.
- **Borders**: Always use `--border` with low opacity. Never harsh lines.

---

## 3. Typography Rules

### Font Families

| Purpose | Font | Weight Range | Source |
|---------|------|-------------|--------|
| Display / Headers | M PLUS Rounded 1c | 700, 800 | Google Fonts |
| Body / UI | Nunito | 400, 600, 700 | Google Fonts |
| Monospace / Stats | JetBrains Mono | 400, 700 | Google Fonts |

### Typography Hierarchy

| Level | Mobile Size | Desktop Size | Weight | Line Height | Font | Letter Spacing | Usage |
|-------|------------|-------------|--------|-------------|------|---------------|-------|
| Display | 2rem (32px) | 3rem (48px) | 800 | 1.1 | M PLUS Rounded | -0.02em | Hero titles, splash |
| H1 | 1.5rem (24px) | 2rem (32px) | 800 | 1.2 | M PLUS Rounded | -0.01em | Page titles |
| H2 | 1.25rem (20px) | 1.5rem (24px) | 700 | 1.3 | M PLUS Rounded | 0 | Section headers |
| H3 | 1.125rem (18px) | 1.25rem (20px) | 700 | 1.3 | M PLUS Rounded | 0 | Card titles |
| Body | 0.875rem (14px) | 1rem (16px) | 400 | 1.6 | Nunito | 0 | Paragraphs, descriptions |
| Body Bold | 0.875rem (14px) | 1rem (16px) | 700 | 1.6 | Nunito | 0 | Emphasis, labels |
| Caption | 0.75rem (12px) | 0.875rem (14px) | 600 | 1.4 | Nunito | 0.02em | Badges, small labels |
| Mono | 0.875rem (14px) | 1rem (16px) | 700 | 1.4 | JetBrains Mono | 0 | HP, SP, scores, stats |
| Tiny | 0.625rem (10px) | 0.75rem (12px) | 700 | 1.3 | Nunito | 0.05em | Micro labels, timestamps |

### Typography Rules
- **Headings**: Use M PLUS Rounded. Mixed case (Title Case), NOT all caps.
- **Body**: Use Nunito. Natural sentence case.
- **Stats**: Use JetBrains Mono for numbers that change (HP, SP, score).
- **Badges**: Use Nunito 700 at Caption size with 0.02em letter-spacing.
- **ALL CAPS**: Only allowed for very small badge labels (10px), never for headings or buttons.
- **Line lengths**: Maximum 60-70 characters for body text.

---

## 4. Component Stylings

### Buttons

#### Primary Button (`.kawaii-btn`)
```css
.kawaii-btn {
  border-radius: 9999px;          /* Pill shape */
  padding: 0.75rem 1.5rem;        /* Generous padding */
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.03em;
  text-transform: none;           /* Mixed case, NOT uppercase */
  background-color: var(--main);
  color: #FFFFFF;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 143, 171, 0.25);
  transition: all 0.2s ease;
  cursor: pointer;
}
.kawaii-btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 6px 20px rgba(255, 143, 171, 0.35);
}
.kawaii-btn:active {
  transform: scale(0.98);
}
.kawaii-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Secondary Button (`.kawaii-btn-outline`)
```css
.kawaii-btn-outline {
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.03em;
  text-transform: none;
  background-color: transparent;
  color: var(--main);
  border: 2px solid color-mix(in srgb, var(--main), transparent 60%);
  transition: all 0.2s ease;
}
.kawaii-btn-outline:hover {
  background-color: color-mix(in srgb, var(--main), transparent 90%);
  border-color: var(--main);
}
```

#### Small Button (`.kawaii-btn-sm`)
```css
.kawaii-btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
}
```

### Cards (`.kawaii-card`)
```css
.kawaii-card {
  border-radius: 1.5rem;           /* 24px — very round */
  background-color: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}
.kawaii-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
```

#### Card Sizes
- `.kawaii-card-sm`: padding 1rem, border-radius 1rem
- `.kawaii-card-md`: padding 1.25rem, border-radius 1.5rem (default)
- `.kawaii-card-lg`: padding 1.5rem, border-radius 1.5rem

### Inputs (`.kawaii-input`)
```css
.kawaii-input {
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  font-family: 'Nunito', sans-serif;
  font-size: 0.875rem;
  background-color: var(--bg-surface-alt);
  border: 2px solid var(--border);
  color: var(--text-primary);
  transition: all 0.2s ease;
  outline: none;
}
.kawaii-input:focus {
  border-color: var(--main);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--main), transparent 85%);
}
.kawaii-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}
```

### Navigation

#### Bottom Nav
```css
.kawaii-nav {
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 0.5rem 1.5rem;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
}
.kawaii-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 1rem;
  transition: all 0.2s ease;
}
.kawaii-nav-item--active {
  background-color: color-mix(in srgb, var(--main), transparent 90%);
  color: var(--main);
}
.kawaii-nav-item--inactive {
  color: var(--text-secondary);
}
```

#### Header
```css
.kawaii-header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
}
```

### Battle Panels (`.kawaii-panel`)
```css
.kawaii-panel {
  border-radius: 1.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
}
```
- No scanline effects
- No HUD corner brackets
- No glassmorphism
- Optional: subtle sparkle decoration in corner (position: absolute, opacity: 0.1)

### HP Bar (`.kawaii-hp-bar`)
```css
.kawaii-hp-bar {
  height: 0.75rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--bg-surface), transparent 50%);
  border: 1px solid var(--border);
  overflow: hidden;
}
.kawaii-hp-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}
```

#### HP Bar Colors
| HP Percentage | Gradient | Meaning |
|--------------|----------|---------|
| 71-100% | `#A8E6CF` → `#7DD3A8` (Matcha) | Healthy |
| 41-70% | `#FFD97D` → `#FFC94D` (Yuzu) | Caution |
| 21-40% | `#FFD1DC` → `#FF8FAB` (Pink) | Warning |
| 0-20% | `#FF6B8A` → `#E85577` (Ume) | Critical (gentle pulse) |

### SP Bar (`.kawaii-sp-bar`)
```css
.kawaii-sp-bar-fill {
  background: linear-gradient(to right, #B8A9C9, #FF8FAB);  /* Wisteria → Sakura */
}
```

### Badges (`.kawaii-badge`)
```css
.kawaii-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}
.kawaii-badge--success {
  background-color: color-mix(in srgb, var(--accent), transparent 85%);
  color: var(--accent);
}
.kawaii-badge--warning {
  background-color: color-mix(in srgb, var(--warning), transparent 85%);
  color: #B8860B;  /* Darker yellow for contrast */
}
.kawaii-badge--danger {
  background-color: color-mix(in srgb, var(--danger), transparent 85%);
  color: var(--danger);
}
.kawaii-badge--neutral {
  background-color: color-mix(in srgb, var(--text-secondary), transparent 90%);
  color: var(--text-secondary);
}
```

### Modals (`.kawaii-modal`)
```css
.kawaii-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--bg-primary), transparent 20%);
  backdrop-filter: blur(4px);
  z-index: 50;
}
.kawaii-modal {
  background-color: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 1.5rem;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
  padding: 1.5rem;
  max-width: 24rem;
  width: 100%;
}
```

### Tooltips (`.kawaii-tooltip`)
```css
.kawaii-tooltip {
  background-color: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 5. Layout Principles

### Spacing Scale (4px base)
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Small gaps, inline elements |
| `--space-3` | 12px | Card padding (compact) |
| `--space-4` | 16px | Card padding, button gaps |
| `--space-5` | 20px | Section gaps (small) |
| `--space-6` | 24px | Section gaps, card padding (comfortable) |
| `--space-8` | 32px | Major section gaps |
| `--space-10` | 40px | Page section dividers |
| `--space-12` | 48px | Hero spacing |
| `--space-16` | 64px | Maximum spacing |

### Grid System
- **Desktop (≥768px)**: 12-column grid, max-width 48rem (768px) centered
- **Tablet (≥640px)**: 2-column grid for cards
- **Mobile (<640px)**: Single column, full width

### Whitespace Philosophy
- **Generous**: Minimum 1.5rem between major sections
- **Breathing Room**: Cards should never touch edges; minimum 1rem padding
- **Vertical Rhythm**: Consistent spacing between similar elements
- **Content Width**: Never exceed 60-70 characters per line for readability

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Small elements (badges, tags) |
| `--radius-md` | 12px | Medium elements (inputs, small cards) |
| `--radius-lg` | 16px | Large elements (cards, panels) |
| `--radius-xl` | 24px | Extra large (modals, hero cards) |
| `--radius-pill` | 9999px | Pill shapes (buttons, badges, bars) |

---

## 6. Depth & Elevation

### Shadow System

| Level | Name | Light Mode | Dark Mode | Usage |
|-------|------|------------|-----------|-------|
| 0 | Flat | `none` | `none` | Background elements |
| 1 | Subtle | `0 1px 3px rgba(74, 55, 40, 0.04)` | `0 1px 3px rgba(0, 0, 0, 0.2)` | Subtle lift, hover hints |
| 2 | Card | `0 2px 12px rgba(74, 55, 40, 0.06)` | `0 4px 12px rgba(0, 0, 0, 0.3)` | Cards, panels |
| 3 | Elevated | `0 8px 24px rgba(74, 55, 40, 0.08)` | `0 8px 24px rgba(0, 0, 0, 0.4)` | Elevated cards, dropdowns |
| 4 | Modal | `0 12px 36px rgba(74, 55, 40, 0.12)` | `0 12px 36px rgba(0, 0, 0, 0.5)` | Modals, overlays |

### Colored Shadows (Accent)
- **Pink glow**: `0 4px 15px rgba(255, 143, 171, 0.25)` — primary buttons
- **Green glow**: `0 4px 15px rgba(168, 230, 207, 0.25)` — success states
- **Purple glow**: `0 4px 15px rgba(184, 169, 201, 0.25)` — secondary elements

### Surface Hierarchy
```
Level 0: Page background (Sakura Cream / Night Indigo)
  └── Level 1: Cards, panels (Blossom White / Twilight Plum)
        └── Level 2: Elevated cards, dropdowns (white + shadow-3)
              └── Level 3: Modals, overlays (white + shadow-4 + backdrop)
```

---

## 7. Do's and Don'ts

### Do's
- ✅ Use rounded corners on everything (minimum 8px, ideally 16px+)
- ✅ Use soft, diffused shadows with warm tones
- ✅ Use mixed case text for a friendly feel (Title Case, not ALL CAPS)
- ✅ Use pastel colors as backgrounds, saturated colors for actions
- ✅ Add subtle hover animations (scale 1.02, translateY -1px)
- ✅ Use sparkle/star decorations sparingly as accents
- ✅ Keep generous whitespace between elements
- ✅ Use warm brown (#4A3728) for text, not pure black
- ✅ Use pill shapes for buttons and badges
- ✅ Make feedback encouraging ("Nice try!" not "WRONG!")
- ✅ Use smooth, bouncy transitions (ease, 0.2-0.3s)
- ✅ Keep touch targets at least 44x44px

### Don'ts
- ❌ No sharp corners (border-radius < 8px) — feels aggressive
- ❌ No hard/dark shadows — feels heavy and scary
- ❌ No ALL CAPS text for headings or buttons — feels like shouting
- ❌ No neon glow effects — feels cyberpunk, not kawaii
- ❌ No glassmorphism/blur effects — feels cold and technical
- ❌ No scanline/CRT effects — feels retro-digital, not warm
- ❌ No HUD corner brackets — feels military, not friendly
- ❌ No pure black (#000000) backgrounds — feels harsh
- ❌ No pure white (#FFFFFF) text on dark backgrounds — use warm whites
- ❌ No jarring color transitions — keep everything smooth
- ❌ No cramped layouts — always give elements room to breathe
- ❌ No aggressive error messages — keep tone encouraging

---

## 8. Responsive Behavior

### Breakpoints
| Name | Min Width | Usage |
|------|-----------|-------|
| Mobile | 0px | Default, single column |
| `sm` | 640px | 2-column grids |
| `md` | 768px | Desktop layout, sidebar nav |
| `lg` | 1024px | Wide desktop, max-width containers |

### Touch Targets
- **Minimum**: 44x44px for all interactive elements
- **Ideal**: 48x48px for primary actions
- **Spacing**: Minimum 8px between adjacent touch targets

### Collapsing Strategy
- **Navigation**: Bottom bar on mobile, left sidebar on desktop (≥768px)
- **Battle Layout**: Stacked vertically on mobile, grid on desktop
- **Cards**: Single column on mobile, 2-3 columns on tablet/desktop
- **Modals**: Bottom sheet on mobile, centered on desktop
- **Text**: Font sizes scale down on mobile via clamp()

### Mobile-Specific Adjustments
- Bottom padding on mobile: `calc(0.75rem + env(safe-area-inset-bottom, 0px))`
- Battle question area: scrollable, with bottom spacer for fixed nav
- Enemy panel: sticky on mobile (below header), static on desktop

---

## 9. Agent Prompt Guide

### Quick Color Reference

```
Light Mode Colors:
  --bg-primary:    #FFF8F5  (Sakura Cream)
  --bg-surface:    #FFFFFF  (Blossom White)
  --bg-surface-alt:#FFF0F3  (Petal Pink)
  --main:          #FF8FAB  (Sakura Pink)
  --main-light:    #FFD1DC  (Soft Pink)
  --secondary:     #B8A9C9  (Wisteria)
  --accent:        #A8E6CF  (Matcha Green)
  --warning:       #FFD97D  (Yuzu Yellow)
  --danger:        #FF6B8A  (Ume Red)
  --text-primary:  #4A3728  (Sumi Ink)
  --text-secondary:#8B7E74  (Fude Gray)
  --border:        #F0E6E0  (Soft Line)

Dark Mode Colors:
  --bg-primary:    #1A1525  (Night Indigo)
  --bg-surface:    #2D2640  (Twilight Plum)
  --bg-surface-alt:#3A3252  (Dusk Mauve)
  --main:          #FFB3C6  (Neon Sakura)
  --main-light:    #FFD1DC  (Glow Pink)
  --secondary:     #C8B6E2  (Star Wisteria)
  --accent:        #B8F0D8  (Neon Matcha)
  --warning:       #FFE5A0  (Neon Yuzu)
  --danger:        #FF8FA3  (Neon Ume)
  --text-primary:  #F0E6F0  (Moon White)
  --text-secondary:#A89BA8  (Cloud Gray)
  --border:        #3D3555  (Night Line)
```

### Ready-to-Use Prompts

**For new components:**
> "Style this component as kawaii: use border-radius 16px+, soft shadows, Nunito font, warm color palette. No sharp corners, no neon effects, no ALL CAPS."

**For buttons:**
> "Make this button kawaii: pill shape (border-radius 9999px), Sakura Pink background, white text, soft pink shadow (0 4px 15px rgba(255,143,171,0.25)). Hover should lift slightly."

**For cards:**
> "Style as kawaii card: 24px border-radius, white background, 1px soft border, very subtle shadow. Hover: lift 2px."

**For inputs:**
> "Kawaii input: 16px radius, 2px border, Petal Pink background. Focus: Sakura Pink border with 3px transparent pink glow."

**For modals:**
> "Kawaii modal: centered, 24px radius, white background, soft backdrop blur. Spring animation on open."

**For battle panels:**
> "Kawaii battle panel: 24px radius, white bg, soft border. No scanlines, no HUD corners. Maybe a subtle sparkle in the corner."

**For feedback text:**
> "Correct answer: use Matcha Green color, maybe a small sparkle icon. Wrong answer: Ume Red but gentle, encouraging tone."

**For navigation:**
> "Kawaii nav: rounded active indicator, Sakura Pink active color, soft background tint. Mixed case labels, not ALL CAPS."

**For shadows:**
> "Use kawaii shadow level 2: 0 2px 12px rgba(74, 55, 40, 0.06) for light mode, 0 4px 12px rgba(0, 0, 0, 0.3) for dark mode."

### CSS Variable Quick Reference
```css
/* Always use these variables, never hardcode colors */
var(--bg-primary)      /* Page background */
var(--bg-surface)      /* Card background */
var(--bg-surface-alt)  /* Hover/input background */
var(--main)            /* Primary actions */
var(--main-light)      /* Hover states */
var(--secondary)       /* Secondary actions */
var(--accent)          /* Success/positive */
var(--warning)         /* Caution */
var(--danger)          /* Error/negative */
var(--text-primary)    /* Main text */
var(--text-secondary)  /* Secondary text */
var(--border)          /* Borders/dividers */
```
