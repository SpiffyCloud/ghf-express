# GHF Express

A simple mobile application built with **SvelteKit 5** and **CapacitorJS 6**. The app allows users to store their Gainesville Health & Fitness (GHF) gym membership ID and generates a barcode for quick access to the gym. **Note:** This app is not affiliated with GHF and is for personal use only.

## Features

- Simple and clean UI for maximum usability.
- Store GHF gym membership ID.
- Display a barcode corresponding to the membership ID for easy gym entry.
- Offline functionality for accessing the barcode without an internet connection.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development](#development)
- [Deployment](#deployment)

## Prerequisites

Before you start, ensure you have the following installed:

- A code editor like [VSCode](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (v18 or later recommended)

## Development

### 1. Clone the Repository

Start by cloning this repository locally:

```bash
git clone git@github.com:SpiffyCloud/ghf-express.git
cd ghf-express
```

### 2. Install Dependencies

Install the necessary npm packages:

```bash
npm install
```

### 3. Develop Locally

Start the SvelteKit development server:

```bash
npm run dev
```

The app will be available on `http://localhost:5173`. As you make changes to your Svelte files, the page will automatically reload.

### 4. Run on iOS Simulator

To run the app on an iOS simulator, build and run the app from the command line:

```bash
npx cap run ios
```

### 5. Open in Xcode for Native Development or Configuration Changes (Optional)

To open the iOS project in Xcode:

```bash
npx cap open ios
```

This will open the iOS project in Xcode, where you can make changes to the native code or configuration.

## Deployment

### 1. Build the Web App

When you're ready to publish the app, first create an optimized production build of the SvelteKit app:

```bash
npm run build
```

This will generate a production-ready version of the app in the `build/` directory.

### 2. Sync with Capacitor

After building, ensure your latest web assets are in sync with Capacitor:

```bash
npx cap sync
```

## Disclaimer

This app is not affiliated with Gainesville Health & Fitness (GHF) and may not be officially supported by their system. Please verify its compatibility with your local gym before using the barcode functionality for entry.
