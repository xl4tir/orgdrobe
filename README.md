<div align="center">

# 👗 OrgDrobe

### Your whole wardrobe, finally organized.

Catalogue every garment, craft outfits you’ll actually wear, and rediscover the pieces hiding in the back of the closet.

<br/>

[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui&logoColor=white)](https://mui.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
![License](https://img.shields.io/badge/license-MIT-1B1712)

</div>

---

## ✨ What is OrgDrobe?

OrgDrobe is a **digital wardrobe** web app. Photograph and tag what you own, then let the
app help you actually wear it — build outfits on a drag‑and‑drop canvas, get suggestions
that match today’s weather, and see honest stats about the colours you reach for and the
pieces gathering dust.

> **Try it in seconds:** the login screen ships with a demo account pre‑filled — just press **Log in**.

---

## 🎯 Features

| | |
|---|---|
| 🧺 **Wardrobe** | A searchable, filterable grid of every garment. Filter by category, colour, season, or how often you actually wear it. Real photos, with an elegant colour‑silhouette fallback. |
| ➕ **Add garment** | A polished dialog with **real photo upload** (file picker *or* drag & drop), category, colours, seasons, brand & material — with a live preview. |
| 🪄 **Outfit builder** | Compose outfits by **dragging** pieces between your wardrobe and the outfit, reorder them, and switch between *Cover · Grid · Canvas* layouts. |
| 📊 **Dashboard** | A weather widget, quick stats, weather‑aware suggestions, and a “your palette” breakdown of your most‑worn colours. |
| 🕓 **Feed** | A timeline of everything you’ve worn and added — toggle between verbose and concise. |
| 🗓️ **Calendar** | A month view of what you wore, day by day. |
| ⚙️ **Settings** | Profile, security, and a light/dark **appearance** toggle. |
| 🌗 **Theming** | A hand‑built design system with light & dark modes, editorial typography, and tasteful motion throughout. Fully responsive from phones to wide desktops. |

---

## 🛠️ Tech stack

| Concern | Choice |
|---|---|
| Framework | **React 18** + **TypeScript** |
| Build tool | **Vite 6** |
| UI system | **Material UI (MUI) v6** + Emotion |
| Animation | **Framer Motion** |
| Drag & drop | **@dnd‑kit** |
| Routing | **React Router v6** |
| State | **Zustand** (with `persist` for auth) |
| Fonts | **Fraunces** + **Manrope** (bundled, offline) |

---

## 🚀 Getting started

```bash
# 1. install
npm install

# 2. run the dev server → http://localhost:5173
npm run dev
```

Other scripts:

```bash
npm run build      # type-check + production build to /dist
npm run preview    # preview the production build
npm run typecheck  # types only, no emit
```

---

## 🗂️ Project structure

The codebase is **feature‑first**: each domain owns its pages, components, store and data.
Shared building blocks live in `components/` and `lib/`, and the whole look is driven by a
single set of design tokens.

```
src/
├── app/                  # composition: router, providers, navigation config
├── theme/                # design system — tokens, palette, typography, motion
│   ├── tokens.ts         # colours, radii, gradients, shadows, easings
│   ├── palette.ts        # light + dark palettes
│   ├── typography.ts     # serif display + sans body scale
│   └── components.ts     # global MUI overrides
├── components/
│   ├── layout/           # AppShell, Header, SidebarNav, BottomNav, guards
│   └── ui/               # GarmentVisual, OutfitVisual, EmojiTile, cards, …
├── features/
│   ├── landing/          # marketing landing page
│   ├── auth/             # login / register + auth store
│   ├── dashboard/        # weather, stats, suggestions, palette
│   ├── garments/         # wardrobe grid, filters, detail, add-dialog, store
│   ├── outfits/          # outfit grid + drag-and-drop editor, store
│   ├── feed/             # activity timeline
│   ├── calendar/         # month view
│   └── settings/         # profile, security, appearance
├── lib/                  # colour catalogue, mock data, formatters, helpers
├── types/                # domain models (Garment, Outfit, …)
└── styles/               # global.css
```

---

## 🎨 Design language

- **Editorial pairing** — *Fraunces* (display serif) for headlines, *Manrope* for UI.
- **Signature palette** — an iris‑violet → coral gradient over warm, clay‑tinted neutrals.
- **Never‑broken imagery** — garments show real photos; if one fails to load, the UI falls
  back to a colour silhouette derived from the garment’s own colours. Decorative hero and
  auth flourishes use playful emoji tiles.
- **Motion, tastefully** — page transitions, staggered card reveals, hover lift, an animated
  theme toggle — all respecting `prefers-reduced-motion`.
- **Light & dark**, responsive from 360 px phones to wide desktops.

---

## 🧭 Notes & roadmap

- Data is currently **mock data** held in Zustand stores — swapping in a real API means
  replacing store action bodies; component contracts stay the same.
- Uploaded photos are kept in memory as data URLs (session‑scoped for now).
- **Next up:** persistent storage (IndexedDB / backend), real weather API, colour extraction
  from uploaded photos, and shareable outfit links.

---

<div align="center">

Made with care for people who love their clothes. · **MIT License**

</div>
