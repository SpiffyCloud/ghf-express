# Agent instructions for GHF Express

## Project overview

- Ionic Vue 8 (Vue 3 + Composition API) app, built with Vite and Tailwind v4.
- Single-screen UX: membership ID input + barcode display. Primary flow lives in `src/views/HomePage.vue`.
- Native shell via Capacitor 8 (iOS project in `ios/`).

## Key architecture and data flow

- App entry: `src/main.ts` registers Ionic, router, and PWA elements for web ActionSheet support.
- Routing is minimal: `/home` only, defined in `src/router/index.ts`.
- Membership ID is stored in `@capacitor/preferences` under key `barcode`, then rendered as Code39 SVG via `jsbarcode` in `HomePage.vue`.
- Analytics events go through `src/lib/analytics.ts`, which logs only on native platforms using `@capacitor-firebase/analytics`.

## UI + styling conventions

- Components are small and focused in `src/components/` (e.g., `IconButton.vue`, `BackgroundVisuals.vue`).
- Tailwind v4 is configured in `src/theme/variables.css` using the `@theme` block and custom colors/animation.
- Fonts are custom-loaded in `src/theme/variables.css` (Menlo).

## Developer workflows (from README/package.json)

- Install: `npm install`
- Dev server: `npm run dev` (Vite on http://localhost:5173)
- Build web bundle: `npm run build` (runs `vue-tsc` then `vite build`)
- Preview build: `npm run preview`
- Unit tests: `npm run test:unit` (Vitest + jsdom)
- Lint: `npm run lint`

## Capacitor (iOS) workflow

- After web changes: `npm run build` then `npx cap sync`.
- Run iOS: `npx cap run ios` or open Xcode via `npx cap open ios`.
- App version shown in UI is loaded from `@capacitor/app` in `HomePage.vue`.

## Assets generation

- Splash screens/icons use `assets/` source images and `npx @capacitor/assets generate --ios|--android` (see `assets/README.md`).

## Patterns worth preserving

- Prefer Composition API `script setup` in Vue SFCs.
- Use Capacitor plugins for native behavior; on web provide fallback (e.g., ActionSheet fallback to `window.confirm` in `HomePage.vue`).
- Keep analytics calls behind `trackEvent()` so web builds are no-op.
