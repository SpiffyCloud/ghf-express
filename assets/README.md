# Generating Splash Screens and Icons

To generate splash screens and icons for your CapacitorJS application, follow the steps below.

## 1. Install `@capacitor/assets`

In your project root, install the `@capacitor/assets` package, which helps generate the necessary assets:

```bash
npm install @capacitor/assets --save-dev
```

## 2. Prepare Your Source Images

Place your source images inside the `resources` folder with the following structure:

```
resources/
├── icon-only.png          # Icon image (1024px x 1024px minimum)
├── icon-foreground.png    # (optional) Foreground image for adaptive icons
├── icon-background.png    # (optional) Background image for adaptive icons
├── splash.png             # Splash screen (2732px x 2732px minimum)
└── splash-dark.png        # (optional) Dark mode splash screen
```

- **Icon files** should be at least `1024px x 1024px`.
- **Splash screen files** should be at least `2732px x 2732px`.
- Use `png` or `jpg` formats.

## 3. Generate the Assets

Run the following commands to generate icons and splash screens for both iOS and Android:

### iOS:

```bash
npx @capacitor/assets generate --ios
```

### Android:

```bash
npx @capacitor/assets generate --android
```

These commands will create the necessary images and place them in the appropriate native platform directories.

## Additional Resources

For more details, see the official CapacitorJS documentation on [Splash Screens and Icons](https://capacitorjs.com/docs/guides/splash-screens-and-icons).
