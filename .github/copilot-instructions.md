# Copilot instructions (ghf-express)

## Big picture
- Ionic Vue 8 (Vue 3) app built with Vite and packaged for iOS via Capacitor 8.
- Single-route app: router redirects `/` → `/home` and renders `src/views/HomePage.vue`.
- Web + native share the same built assets: Capacitor `webDir` is `dist` (see `capacitor.config.ts`).

## Core feature flow (barcode)
- Membership ID is a **6-digit string** stored under `Preferences` key `barcode` (see `loadStoredBarcode()` / `saveBarcode()` in `src/views/HomePage.vue`).
- Barcode rendering uses `jsbarcode` into `<svg id="barcode">` with `format: 'CODE39'`, then post-processes SVG `<rect>` nodes to add rounded corners.
- Delete resets via `Preferences.clear()` (wipes all preference keys, not just `barcode`) and always resets the UI in a `finally` block.

## Capacitor plugin conventions
- Destructive actions use Capacitor `ActionSheet.showActions(...)`, with a web/plugin-missing fallback to `window.confirm(...)`.
- Web plugin UI elements are enabled by `defineCustomElements(window)` in `src/main.ts` (needed for consistent ActionSheet UI in the browser).

## Styling + UI conventions
- Most UI is Tailwind-first (utility classes) rather than Ionic components.
- Tailwind has custom `navy` colors and a `blink` animation (see `tailwind.config.js`).
- Global font is set via Ionic variables (see `src/theme/variables.css`).

## Project conventions
- ESM project (`"type": "module"` in `package.json`).
- Strict TypeScript; path alias `@` → `src` (see `vite.config.ts` and `tsconfig.json`).

## Dev workflows
- Dev server: `npm run dev` (Vite on `http://localhost:5173`, strict port).
- Build: `npm run build` (runs `vue-tsc` then `vite build`).
- iOS workflow after changing web code: `npm run build && npx cap sync ios`.
- Run/open iOS: `npx cap run ios` or `npx cap open ios`.

## Tests (keep selectors stable)
- Unit: `npm run test:unit` (Vitest + jsdom; configured in `vite.config.ts`).
- E2E: `npm run test:e2e` (Cypress via `start-server-and-test`, baseUrl `http://localhost:5173`).
- On web, `@capacitor/preferences` persists via browser storage; Cypress resets state with `cy.clearLocalStorage()` (see `tests/e2e/specs/barcode-flow.cy.ts`).
- Prefer stable selectors already used in tests: `#barcode`, `button.key`, and `aria-label` attributes (see `tests/unit/home-page.spec.ts` and `tests/e2e/specs/barcode-flow.cy.ts`).
- When unit testing, mock Capacitor plugins and `jsbarcode` using `vi.mock(...)` (see `tests/unit/home-page.spec.ts`).

## Common edits
- Share link/copy: update `shareApp()` in `src/views/HomePage.vue` (App Store URL + text).
- Preference storage key/shape: `Preferences.get/set({ key: 'barcode' })` in `src/views/HomePage.vue` (tests assume 6 digits).
- Theme colors/animation: `tailwind.config.js` (`navy` palette + `blink`) and `src/theme/variables.css` (global font).
- App version shown in UI: `App.getInfo().version` in `src/views/HomePage.vue` (comes from native project/Xcode settings).
- iOS config sync points: `capacitor.config.ts` (`appId`, `appName`, `webDir`) and `ios/App/App/capacitor.config.json` (`packageClassList`).
- Privacy policy copy/date: `docs/privacy.md`.

## Native/3rd-party integrations
- Firebase Analytics is configured natively (see `ios/App/App/capacitor.config.json` `packageClassList` and `ios/App/App/GoogleService-Info.plist`); there is no JS-side analytics initialization in `src/`.

## Avoid editing generated output
- Don’t hand-edit `dist/`, `ios/DerivedData/`, or `node_modules/` unless explicitly required.
