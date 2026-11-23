# Bonsai Café — Digital Menu

A production-grade, QR-first, Arabic-RTL digital menu for Bonsai Café
(Najaf, Iraq — [@bonsaicafe.iq](https://www.instagram.com/bonsaicafe.iq/)).
React + TypeScript + Vite, with Firebase (Firestore) as an optional,
admin-editable backend — the app works fully on bundled seed data even
before Firebase is configured.

See [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the full design system and
brand audit.

## Features

- Arabic (RTL) + English (LTR) with one tap, logical-property CSS so the
  whole layout mirrors automatically.
- Light/dark theme, following system preference by default.
- Full menu: 14 categories, 120+ real products/prices sourced from the
  café's own live menu (mofidmu.com/menu/bonsai) — see the Brand Audit in
  `DESIGN_SYSTEM.md`.
- Live search, sticky category tabs, product detail bottom sheet.
- Cart with quantity/notes, 2-step checkout, and a clean, pre-formatted
  **WhatsApp ordering flow** (no payment gateway — WhatsApp is the order
  confirmation channel, matching how the café already takes orders).
- Star-rating review form (writes to Firestore when configured).
- Skeleton loading, empty states, graceful fallback when Firebase isn't
  configured yet.
- Code-split Firebase SDK — the main bundle never pays for it unless a
  project is actually configured.

## Tech Stack

React 19 + TypeScript + Vite 8, Firebase (Firestore) SDK, plain CSS Modules
+ design tokens (no UI framework dependency), oxlint.

## Local Development

```powershell
npm install
npm run dev
```

Open the printed `localhost` URL. The app works immediately using the seed
data in `src/data/` — no Firebase project is required to develop or demo it.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run lint` | oxlint |
| `npm run preview` | Preview the production build locally |

## Firebase (optional, for admin-editable content)

1. Copy `.env.example` to `.env` and fill in the Web SDK config from
   **Firebase console → Project settings → General → Your apps**.
2. Create three Firestore collections: `categories`, `products`, `settings`
   (one document, any id, shaped like `src/types.ts#BrandSettings`), seeded
   from `src/data/categories.ts` / `products.ts` / `brand.ts`. A `reviews`
   collection is created automatically by the review form.
3. Deploy the included security rules: `firebase deploy --only firestore:rules`.
4. `npm run build && firebase deploy --only hosting`.

Without a `.env`, the site silently falls back to the bundled seed data —
nothing breaks, nothing fakes a connection.

## Environment Variables

See [`.env.example`](./.env.example). Never commit a real `.env`, a Firebase
service-account key, or any other secret — `.gitignore` already excludes
these patterns.

## Project Structure

```
src/
  components/   UI components (each with its own .module.css)
  context/      ToastContext (feedback messages)
  data/         Seed data: categories, products, brand settings (real data)
  hooks/        useMenuData, useCart, useLang
  lib/          firebase.ts (lazy-loaded, graceful fallback)
  styles/       tokens.css (design tokens) + global.css (resets)
  utils/        currency formatting, WhatsApp message builder
public/
  assets/       brand/ products/ categories/ banners/ icons/ — drop real
                brand photography here once supplied by the café (see
                "Known limitation" in DESIGN_SYSTEM.md)
```

## Known Limitations

- **Logo & product photography are placeholders.** The real Instagram-hosted
  logo and product photos could not be downloaded/relicensed automatically;
  placeholders use the extracted brand palette honestly, not stock photos
  pretending to be Bonsai's own. Swap in real files under `public/assets/`.
- **Rewards/loyalty club, gift cards, table booking and a bilingual full
  website are out of scope.** These were studied as UX references (101
  Coffee) but deliberately not built for this single-location café menu —
  building a full loyalty/CRM system wasn't asked for and would be
  over-engineering for the stated goal of a fast, QR-first ordering menu.
  The data model (Firestore) can support adding them later without a
  rewrite.
- **No payment gateway** — orders are confirmed over WhatsApp, matching how
  the café currently operates (per its Instagram bio).
