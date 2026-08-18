# OrgDrobe 👕

Your digital wardrobe — catalogue your clothes, craft outfits, and rediscover what you own.
Built as a modern, scalable React front-end from the *orgdrobe* Figma prototype.

<p>
  <img alt="React" src="https://img.shields.io/badge/React-18-149ECA" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF" />
  <img alt="MUI" src="https://img.shields.io/badge/MUI-6-007FFF" />
</p>

## Tech stack

| Concern            | Choice                                   |
| ------------------ | ---------------------------------------- |
| Framework          | React 18 + TypeScript                    |
| Build tool         | Vite 6                                    |
| UI system          | Material UI (MUI) v6 + Emotion           |
| Animation          | Framer Motion                            |
| Routing            | React Router v6                          |
| State              | Zustand (with `persist` for auth)        |
| Fonts              | Fraunces + Manrope (bundled, offline)    |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build to /dist
npm run preview    # preview the production build
npm run typecheck  # types only, no emit
```

> A **demo account is pre-filled** on the login screen — just press *Log in*.

## Project structure

The codebase is **feature-first**: each domain owns its pages, components,
store and data. Shared building blocks live in `components/` and `lib/`.

```
src/
├── app/                  # composition: router, providers, navigation config
│   ├── providers/        # AppProviders (theme + router)
│   ├── navigation.tsx    # single source of truth for nav items
│   └── router.tsx        # route table
├── theme/                # design system
│   ├── tokens.ts         # colours, radii, gradients, shadows, motion easings
│   ├── palette.ts        # light + dark palettes
│   ├── typography.ts     # type scale (serif display + sans body)
│   ├── components.ts     # global MUI component overrides
│   ├── motion.ts         # reusable Framer Motion variants
│   └── ColorModeContext  # light/dark provider (persisted)
├── components/
│   ├── layout/           # AppShell, Header, SidebarNav, BottomNav, guards
│   └── ui/               # GarmentVisual, OutfitVisual, cards, StatTile, …
├── features/
│   ├── landing/          # marketing landing page
│   ├── auth/             # login / register + auth store
│   ├── dashboard/        # weather, stats, suggestions, palette
│   ├── garments/         # wardrobe grid, filters, detail, store
│   ├── outfits/          # outfit grid, editor (canvas/grid/cover), store
│   ├── feed/             # activity timeline
│   ├── calendar/         # month view of what was worn
│   └── settings/         # profile, security, appearance
├── lib/                  # colours catalogue, mock data, formatters, helpers
├── types/                # domain models (Garment, Outfit, …)
└── styles/               # global.css
```

## Design language

- **Editorial pairing** — Fraunces (display serif) for headlines, Manrope for UI.
- **Signature palette** — iris violet → coral gradient over warm, clay-tinted neutrals.
- **No image dependencies** — garments render as *fabric gradients* derived from
  each item's own colours, so nothing ever loads broken and the look stays on-brand.
- **Motion everywhere, tastefully** — page transitions, staggered card reveals,
  hover lift, animated theme toggle. Respects `prefers-reduced-motion`.
- **Light & dark**, responsive from 360 px phones to wide desktops.

## Notes

- All data is currently **mock data** (`src/lib/mockData.ts`) held in Zustand
  stores. Swapping in a real API means replacing the store action bodies — the
  component contracts stay the same.
- Auth is mocked and persisted to `localStorage`.
