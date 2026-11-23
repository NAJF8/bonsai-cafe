# Bonsai Café — Design System

Source of truth for the visual language used across the digital menu. Extracted
from the brand's own Instagram (`@bonsaicafe.iq`) wherever possible — the logo
mark, color palette and photography mood are not invented; see **Brand Audit**
at the end of this document for exactly what was and wasn't verifiable.

## 1. Brand Colors

| Token | Hex | Use |
|---|---|---|
| `--bonsai-green-900` | `#15241B` | Deepest background (footer, dark mode bg) |
| `--bonsai-green-800` | `#1D3327` | Dark mode surface |
| `--bonsai-green-700` | `#27452F` | **Primary** — buttons text/links on light, primary brand color |
| `--bonsai-green-600` | `#335A3D` | Hero gradient, focus ring |
| `--bonsai-terracotta-600` | `#B5522E` | **Accent** — CTA buttons, tags, berry accent from the logo |
| `--bonsai-cream-050` | `#FDFBF6` | Light-mode surface (cards, sheets) |
| `--bonsai-cream-100` | `#F7EFE0` | Light-mode background, logo background color |
| `--bonsai-ink-900` | `#201B14` | Primary text (light mode) |

Rule: **never** use raw hex in a component — always the semantic token
(`--color-primary`, `--color-accent`, `--color-background`, etc. in
`src/styles/tokens.css`). Light and dark mode remap the same semantic tokens;
components never branch on theme directly.

## 2. Typography

- **Arabic (primary UI language):** `Cairo` — warm, highly legible, wide
  weight range, native Arabic metrics (no fake-bold/skew).
- **Display / wordmark:** `Jost` with `letter-spacing: 0.22–0.24em` and
  uppercase — mirrors the letter-spaced "BONSAI" wordmark used as a watermark
  across the brand's Instagram photography.
- Scale: `--text-xs` (12px) → `--text-3xl` (36px), `--leading-normal: 1.5`.
- Prices always use **Western (Latin) digits** even in Arabic — standard
  practice for Iraqi digital menus and more legible than Eastern Arabic-Indic
  numerals at a glance.

## 3. Spacing & Radius

4px base scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`.
Radius: `10px` (sm, inputs) / `16px` (md, cards) / `22px` (lg, sheets) /
`999px` (pill, buttons & chips).

## 4. Shadows & Motion

Shadows are always warm-tinted (`rgba(32,27,20,...)`), never pure black —
keeps the premium, non-generic feel in both themes. Motion uses
`cubic-bezier(0.22,1,0.36,1)` ("standard ease"), 120–320ms, and is fully
disabled under `prefers-reduced-motion: reduce` (see `tokens.css`).

## 5. Components

Header · BottomNav (mobile only, ≤760px) · Hero · QuickActions ·
CategoryTabs (sticky, horizontal scroll) · SearchBar · ProductCard ·
ProductModal (bottom sheet) · CartDrawer (side sheet + 2-step checkout) ·
ReviewForm (star rating) · EmptyState · Skeleton loaders · Toast.

Each lives in `src/components/<Name>.tsx` + `<Name>.module.css`. No shared
component imports raw color/spacing values — only tokens.

## 6. Responsive Breakpoints

- **≤760px** — mobile, bottom nav visible, single/2-column product grid.
- **561–899px** — 3-column product grid.
- **≥900px** — content centers in an 880px max-width column; the app
  deliberately does **not** turn into a sprawling desktop marketing site —
  it stays a focused menu, since most real traffic is a QR scan on a phone.

Verified at 360 / 375 / 390 / 412 / 768 / 1024 / 1280 / 1440 / 1920px, light
and dark, AR (RTL) and EN (LTR), portrait and landscape.

## 7. RTL Rules

- `ar` is the default language; `<body dir="rtl">` on load.
- All directional CSS uses logical properties (`inset-inline-start/end`,
  `padding-inline`, `margin-inline`) — never physical `left`/`right` — so the
  entire layout mirrors automatically in English/LTR.
- Icons that imply direction (the "browse menu" chevron) are flipped with
  `scaleX(-1)` only in RTL; icons that don't imply direction (search, cart,
  star) are never flipped.
- Numerals stay Western/Latin in both languages (see §2).

## 8. What to Avoid (and why)

No glassmorphism, no neon, no decorative blobs, no stock-photo-style AI
gradients unrelated to the brand, no generic "coffee template" cards. The
only gradients used are the two brand colors (green → terracotta) as a
stand-in for real product photography — see **Known limitation** below.

---

## Brand Audit (source: instagram.com/bonsaicafe.iq, mofidmu.com/menu/bonsai)

**Verified from Instagram bio:**
- Name: "Bonsai Café | بونساي"
- Tagline: "قهوة مختصة تنبض بالتفاصيل"
- Hours: "يوميًا من 7:30 ص ولغاية 2:00 بعد منتصف الليل"
- Phone/WhatsApp: 07840799740
- Location text: "النجف حي السلام الأربع شوارع"
- Linked live menu: mofidmu.com/menu/bonsai (★4.8) — used as the **primary,
  verified source** for every category, product name, description and price
  in `src/data/products.ts` and `src/data/categories.ts`. Nothing in that
  file was invented.

**Verified visually (screenshots of the public profile):**
- Logo: cream/beige circular badge, dark forest-green botanical "B" mark with
  small leaf flourishes, two small terracotta/rust berry accents.
- Photography: warm, moody, golden-hour, cinematic — cafe interior, plants,
  product close-ups, a white "BONSAI" letter-spaced wordmark watermark.
- Color impression: deep green + warm cream/neutral + terracotta accent —
  this is the palette encoded in `tokens.css`.

**Update:** the real logo was pulled directly from the Instagram profile
picture (`public/assets/brand/logo.jpg`) and is now used in the header,
hero, footer, splash screen and apple-touch-icon everywhere in the app.

**Remaining limitation:** per-product photography is still an honest
placeholder (brand-color gradient tiles), since individual product photos
weren't available to download/relicense. Before launch, Bonsai should
supply real product photos to `public/assets/products/` — `ProductCard`/
`ProductModal` already expect an `image` field on `Product` (see
`src/types.ts`) and only need that field wired in once real files exist.
