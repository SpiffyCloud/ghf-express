# GHF Express

GHF Express is a simple mobile app built with **Ionic Vue 8 (Vue 3.x)**. It stores your Gainesville Health & Fitness (GHF) membership ID and renders a barcode for quick entry.

This app is not affiliated with GHF and is for personal use only.

## Tech Stack

- Ionic Vue 8 (Vue 3.x)
- Capacitor 8 for native iOS support
- Vite (web dev/build)
- TailwindCSS for styling
- Barcode rendering via `jsbarcode` (Code39 SVG)

## Prerequisites

- Node.js (v18+ recommended)
- Xcode (for iOS builds)

## Development

Install dependencies:

```bash
npm install
```

Run the web dev server:

```bash
npm run dev
```

Vite serves the app at `http://localhost:5173`.

## iOS (Capacitor)

After changing web code, always rebuild + sync before running native:

```bash
npm run build
npx cap sync ios
```

Run on an iOS simulator/device:

```bash
npx cap run ios
```

Open the native project in Xcode:

```bash
npx cap open ios
```

## Release Checklist

- Verify app behavior on web + iOS simulator/device.
- Run checks locally:

```bash
npm run lint
npm run test:unit
npm run test:e2e
```

- Build web assets and sync to iOS:

```bash
npm run build
npx cap sync ios
```

- Run once via CLI (sanity check):

```bash
npx cap run ios
```

- Archive and distribute from Xcode:

```bash
npx cap open ios
```

## Quality

- Unit tests: `npm run test:unit`
- E2E tests (Cypress): `npm run test:e2e`
- Lint: `npm run lint` (ESLint v9 flat config via `eslint.config.js`)

## Notes

- The membership ID is stored using `@capacitor/preferences`.
- Capacitor ActionSheet uses `@ionic/pwa-elements` on web (so it behaves consistently in the browser).

## Disclaimer

This app is not affiliated with Gainesville Health & Fitness (GHF) and may not be officially supported by their system. Please verify compatibility with your local gym before relying on the barcode for entry.
