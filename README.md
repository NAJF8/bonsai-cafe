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
- **Bonsai Club & Rewards** — phone-number membership (no password):
  look up or join from the header. Points start at 0 and are credited by
  staff after a confirmed order, never by the client itself — a client-side
  write can't be trusted to represent a real purchase without a backend
  function, which this project deliberately doesn't add.
- **Digital gift** — send a product or an open amount to someone, with a
  generated gift code; creates a `gifts` record and opens a formatted
  WhatsApp message to the café to arrange it.
- **Table / space reservation** — date, time, party size → `bookings`
  record + a WhatsApp confirmation request, the same honest pattern as
  ordering.
- **Events** — reads an admin-managed `events` collection; shows a real
  empty state (not a fabricated event) when none exist yet.
- Splash screen with the café's real logo on first load.
- Skeleton loading, empty states, graceful fallback when Firebase isn't
  configured yet.
- Code-split Firebase SDK — the main bundle never pays for it unless a
  project is actually configured.

### Why this isn't a 1:1 clone of 101coffees.com

The UX pattern (header icon bar, rewards card, gift, club, events,
reservation, about-stats) is intentionally modeled on 101 Coffee's site per
request, but three things are deliberately different, not missed:

- **Branding stays Bonsai's own** — real logo, colors and copy, never 101's.
- **101 Club's "monthly subscription"** became a free rewards membership
  here, since a real paid subscription needs billing infrastructure this
  project doesn't have and wasn't asked to build.
- **No AI chat assistant** — out of scope for a menu app; the WhatsApp CTA
  already covers "talk to a human."

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
2. Create the Firestore collections `categories`, `products`, `settings`
   (one document, any id, shaped like `src/types.ts#BrandSettings`), and
   optionally `events` — seed them from `src/data/*.ts`, or run
   `npx tsx scripts/seed-firestore.ts` (uses `gcloud auth print-access-token`,
   no service-account key needed). `reviews`, `members`, `gifts` and
   `bookings` are created automatically as people use those features.
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

- **Product photography is still placeholder** (the real Instagram-hosted
  logo is in use — see `public/assets/brand/logo.jpg` — but per-product
  photos weren't available to download/relicense). Add real photos to
  `public/assets/products/` and wire `Product.image` once supplied.
- **Rewards points are credited manually by staff**, not automatically —
  see "Why this isn't a 1:1 clone" above for why.
- **No payment gateway** — orders, gifts and reservations are all confirmed
  over WhatsApp, matching how the café currently operates.
- **No AI chat assistant and no Google-account login** for rewards — phone
  number is the only identifier, which keeps the feature honest without
  adding real authentication infrastructure.
