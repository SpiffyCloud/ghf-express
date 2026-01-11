# Copilot Instructions

## Project Map

- Active app is **Ionic Vue (Vue 3 + Vite) + Capacitor 8**. Entry is [src/main.ts](../src/main.ts), which bootstraps IonicVue, initializes PWA Elements (for web plugin UIs), and mounts routes via [src/router/index.ts](../src/router/index.ts).

- Primary screen is `/home`, implemented in [src/views/HomePage.vue](../src/views/HomePage.vue) (membership ID entry, barcode rendering, share, edit/delete, etc.).

- Native projects live in [ios](../ios) (and/or Android if added).

- Platform collateral is sourced from [resources](../resources) with generation steps documented in [assets/README.md](../assets/README.md); keep filenames consistent with Capacitor expectations.

## Key Workflows

- Install deps with `npm install`, then run `npm run dev` for the web preview; Vite dev server is `http://localhost:5173`, matching [cypress.config.ts](../cypress.config.ts).

- Production builds require `npm run build` (runs `vue-tsc` then `vite build`) and `npx cap sync ios` so Capacitor copies the `dist` output defined in [capacitor.config.ts](../capacitor.config.ts).

- Use `npx cap run ios` or `npx cap open ios` after syncing when you need to test native behavior or tweak Xcode-specific assets.

- Unit tests run with `npm run test:unit` (Vitest + Vue Test Utils) and live in [tests/unit](../tests/unit); E2E specs live in [tests/e2e/specs](../tests/e2e/specs) and execute through `npm run test:e2e`.

- `npm run lint` enforces ESLint + eslint-plugin-vue defaults; run it before opening PRs to keep CI clean.

## Patterns & Conventions

- Prefer Ionic components (`IonPage`, `IonContent`, etc.) for screen scaffolding as shown in [src/views/HomePage.vue](../src/views/HomePage.vue).

- Route additions go through [src/router/index.ts](../src/router/index.ts); use the existing alias `@` from [vite.config.ts](../vite.config.ts) for cleaner imports.

- Barcode features: persist IDs via `@capacitor/preferences`, render Code39 SVGs via `jsbarcode`, and keep the UI behavior stable across web + native.

- Web implementations of certain Capacitor plugin UIs (e.g. ActionSheet) rely on `@ionic/pwa-elements`; initialization happens in [src/main.ts](../src/main.ts).

- Privacy and policy text for store submissions is sourced from [docs/privacy.md](../docs/privacy.md); update it alongside in-app copy to avoid compliance drift.

## Reference Material

- Root [README.md](../README.md) documents the current Vue + Capacitor 8 workflow; scripts are authoritative in [package.json](../package.json).

- Use [tests/e2e/specs/test.cy.ts](../tests/e2e/specs/test.cy.ts) and [tests/unit/example.spec.ts](../tests/unit/example.spec.ts) as patterns.

- iOS-specific resources live under [ios](../ios).

- Keep SVG + Tailwind-heavy layouts from the legacy screen handy—they capture the product voice and can be transplanted into Vue templates with `<IonContent>` wrappers.

- Store reusable Capacitor or UI helpers inside feature folders (e.g. `src/features/...`) to keep tree depth shallow until the app grows.
