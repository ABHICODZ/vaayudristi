# VayuDrishti Design System Specification

## Design Philosophy

**NOT a website. A SYSTEM INTERFACE.**

### Core Principles
1. **Apple-level Clarity** - Every element has purpose
2. **Government-grade Seriousness** - Trustworthy, not flashy
3. **ISRO Control-room Precision** - Accurate, real-time, reliable
4. **Minimal but Deep** - Fewer elements, more meaning

### Tone
- Calm
- Confident
- Intelligent
- Purpose-driven

---

## Typography System

### Primary Font
**Inter** (system fallback: -apple-system, BlinkMacSystemFont, "Segoe UI")

### Type Scale
```
Hero:        96px / 128px (font-light, tracking-tight)
H1:          80px / 96px  (font-light, tracking-tight)
H2:          60px / 72px  (font-light)
H3:          32px / 40px  (font-light)
Body Large:  24px / 36px  (font-light, text-slate-400)
Body:        18px / 28px  (text-slate-400)
Small:       14px / 20px  (text-slate-500)
Mono:        12px / 16px  (font-mono, uppercase, tracking-widest)
```

### Typography Rules
- **Large, confident headings** - Typography is primary design tool
- **Clean spacing** - Generous whitespace
- **Light weight** - font-light for all headings
- **Mono for system info** - Uppercase, wide tracking

---

## Color System

### Base Palette
```css
Background:   slate-950  (#020617)
Surface:      slate-900  (#0f172a)
Border:       slate-800  (#1e293b)
Text Primary: slate-50   (#f8fafc)
Text Secondary: slate-400 (#94a3b8)
Text Tertiary: slate-500  (#64748b)
```

### Accent Colors (Minimal Use)
```css
Blue:    #3b82f6  (Data/Sensors)
Purple:  #a855f7  (AI/Processing)
Green:   #22c55e  (Status/Active)
Orange:  #f97316  (Alerts/Warnings)
Yellow:  #eab308  (Caution)
```

### Indian Context (Subtle)
```css
Tricolor Gradient: from-blue-500 via-slate-50 to-orange-500
Usage: Minimal accents only (progress bars, dividers)
```

### Color Rules
- **Dark mode only** - slate-950 background
- **Minimal color** - Use sparingly for emphasis
- **No gradients** except subtle tricolor accents
- **Status colors** - Green (active), Yellow (degraded), Red (offline)

---

## Spacing System

### Scale (Tailwind)
```
xs:  0.5rem  (8px)
sm:  1rem    (16px)
md:  1.5rem  (24px)
lg:  2rem    (32px)
xl:  3rem    (48px)
2xl: 4rem    (64px)
3xl: 6rem    (96px)
4xl: 8rem    (128px)
```

### Section Spacing
- **Min height**: 100vh per major section
- **Padding**: 6rem (96px) vertical, 1.5rem (24px) horizontal
- **Max width**: 80rem (1280px) for content
- **Grid gaps**: 2rem (32px) standard

---

## Layout Structure

### Page Anatomy
```
1. System Status Bar (fixed top-right)
2. Scroll Progress (fixed top)
3. Hero Section (100vh)
4. System Overview (100vh)
5. Capabilities (100vh)
6. Live System Preview (100vh)
7. Governance Impact (100vh)
8. CTA (100vh)
9. Footer (minimal)
```

### Grid System
- **3-column** for capabilities
- **2-column** for overview
- **4-column** for metrics
- **Responsive**: Stack on mobile

---

## Components

### System Status Bar
```tsx
Position: fixed top-right
Elements:
- Status indicator (pulsing dot)
- System status text
- Last update time
Font: mono, 12px, uppercase
```

### Scroll Progress
```tsx
Position: fixed top
Height: 2px
Gradient: blue-500 to orange-500
Width: Based on scroll percentage
```

### Data Block
```tsx
Border: 1px slate-800
Padding: 2rem
Hover: border-slate-700
Content:
- Large number (48px, font-light)
- Label (12px, mono, uppercase, slate-500)
- Progress bar (optional)
```

### Trust Indicator
```tsx
Elements:
- Colored dot (8px)
- Label (14px, slate-300)
- Description (12px, slate-500)
Colors:
- Green: Real sensor data
- Blue: ML interpolated
- Purple: Satellite derived
```

### Capability Card
```tsx
Border: 1px slate-800
Padding: 2rem
Icon: 32px, colored
Title: 32px, font-light
Description: 18px, slate-400
Meta: 12px, mono, uppercase, slate-500
```

---

## Motion & Interaction

### Principles
- **Slow and smooth** - No jarring animations
- **Purposeful** - Motion conveys meaning
- **Subtle** - Never distracting

### Transitions
```css
Default: transition-colors duration-300
Hover: border-slate-700 (from slate-800)
Scroll: Smooth, native
```

### Animations
- **Particle field**: Slow drift, 0.2px/frame
- **Status dot**: Pulse animation, 2s duration
- **Scroll indicator**: Fade in/out based on position

### NO Animations
- ❌ Excessive motion
- ❌ Flashy effects
- ❌ Distracting transitions
- ❌ Auto-playing videos

---

## WebGL Integration

### Particle Field
```
Purpose: Subtle pollution visualization
Particles: 30 total
Size: 1-2px
Color: rgba(100, 116, 139, 0.3)
Motion: Slow drift (0.2px/frame)
Position: Fixed background, z-index: 0
Opacity: 40%
```

### Rules
- **Stay in background** - Never overpower content
- **Minimal** - 30 particles max
- **Slow** - Barely perceptible motion
- **Subtle** - Low opacity

---

## Scrollable Experience

### Section Flow
1. **Hero** - Clear statement
2. **Overview** - Context and purpose
3. **Capabilities** - What it does
4. **Live State** - Real data
5. **Impact** - Why it matters
6. **CTA** - Next action

### Scroll Indicators
- **Top**: Progress bar (2px)
- **Bottom of hero**: Scroll prompt with arrow
- **Smooth**: Native scroll behavior

---

## Trust & Realness

### Data Attribution
Every data point must show:
- **Source**: WAQI / GEE / ML
- **Timestamp**: Last updated time
- **Confidence**: Real / Interpolated / Forecast

### System Status
- **Live indicator**: Pulsing dot
- **Status text**: Operational / Degraded / Offline
- **Update time**: Real-time or timestamp

### No Fake Behavior
- ❌ No mock data
- ❌ No fake loading states
- ❌ No placeholder content
- ✅ Real data or explicit "Loading"
- ✅ Error states shown clearly
- ✅ Source attribution always visible

---

## Responsive Design

### Breakpoints
```
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Mobile Adaptations
- **Typography**: Scale down 20%
- **Grid**: Stack to single column
- **Spacing**: Reduce by 25%
- **Hero**: 80px font size
- **Sections**: Still full height

---

## Indian Context (Subtle)

### Visual Elements
- **Tricolor accent**: Minimal use in progress bars
- **Map grid**: Subtle background pattern
- **Clean structure**: Government-appropriate

### What to AVOID
- ❌ Loud patriotic visuals
- ❌ Flag imagery
- ❌ Clichéd symbols
- ❌ Overly decorative elements

### What to USE
- ✅ Subtle tricolor gradient (progress bar)
- ✅ Clean, structural design
- ✅ Professional, serious tone
- ✅ National-scale language

---

## Self-Critique Checklist

Before finalizing any design:

- [ ] Does this look like a template? → FIX IT
- [ ] Does it feel like a real system? → MUST BE YES
- [ ] Is anything unnecessary? → REMOVE IT
- [ ] Is it too flashy? → TONE IT DOWN
- [ ] Is it too empty? → ADD MEANING
- [ ] Would an engineer respect this? → MUST BE YES
- [ ] Would a government judge trust this? → MUST BE YES
- [ ] Does it feel human and thoughtful? → MUST BE YES

---

## Implementation Notes

### Tech Stack
- React + TypeScript
- Tailwind CSS
- Canvas API (for particles)
- Lucide React (icons)

### Performance
- **Lazy load**: Sections below fold
- **Optimize**: Canvas rendering
- **Minimize**: Bundle size
- **Fast**: <3s initial load

### Accessibility
- **Contrast**: WCAG AAA
- **Focus states**: Visible
- **Keyboard nav**: Full support
- **Screen readers**: Semantic HTML

---

## Design Intent

This is NOT a website to impress beginners.

This is a SYSTEM INTERFACE to impress:
- Experienced engineers
- Government judges
- System architects
- National decision-makers

The result must feel:
- **Intentional** - Every element has purpose
- **Refined** - Polished to perfection
- **Trustworthy** - Real, not fake
- **Memorable** - Distinct, not generic

**If it looks like "AI made this" → WE FAILED.**

Make it feel human, thoughtful, and real.

**NO COMPROMISE.**
