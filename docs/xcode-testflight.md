# Xcode and TestFlight Setup

This guide covers building the Ferber Timer app for iOS and submitting to TestFlight (and optionally the App Store).

## Prerequisites

- **Apple Developer account** (paid) — [developer.apple.com/account](https://developer.apple.com/account/)
- **Expo account** — [expo.dev/signup](https://expo.dev/signup)
- **macOS with Xcode** (only required for the “Prebuild + Xcode” path)

**Upload without Apple ID prompts:** To use an App Store Connect API key (e.g. for CI or to avoid entering credentials each time), see **[App Store Connect API setup](./app-store-connect-api.md)**.

## Configuration in this repo

- **`app.json`** — `expo.ios.bundleIdentifier` is set to `com.ferbertimer.app` and `buildNumber` to `1`. Change the bundle ID if you use a different team or app name.
- **`eas.json`** — EAS Build and submit profiles. Before using EAS Submit or `npx testflight`, set `submit.production.ios.ascAppId` to your App Store Connect app ID (see below).

---

## Option 1: EAS Build + TestFlight (recommended)

No need to open Xcode. Build in the cloud and submit to TestFlight.

### One-time setup

1. Install EAS CLI and log in:
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. Link the project to EAS (first time only):
   ```bash
   eas build:configure
   ```

3. Create the app in App Store Connect (if you haven’t already):
   - Go to [App Store Connect](https://appstoreconnect.apple.com) → **Apps** → **+** → **New App**.
   - Fill in name, language, **Bundle ID** (must match `app.json`: `com.ferbertimer.app`), and SKU.
   - After the app is created, get the **Apple ID** (numeric): **App Information** → **General** → **Apple ID**.
   - Put that number in `eas.json` under `submit.production.ios.ascAppId` (replace `YOUR_APP_STORE_CONNECT_APP_ID`).

### Build and submit

**Single command (build + sign + submit to TestFlight):**

```bash
npx testflight
```

Follow the prompts (bundle ID, Apple ID, 2FA, credentials). The CLI will build, then submit the build to TestFlight. `buildNumber` in `app.json` is incremented automatically on subsequent runs.

**Or build and submit in two steps:**

```bash
# Build for iOS (production profile)
eas build --platform ios --profile production

# After the build finishes, submit the last build to TestFlight
eas submit --platform ios --profile production
```

To build on your Mac instead of the cloud:

```bash
eas build --platform ios --profile production --local
```

---

## Option 2: Prebuild + Xcode

Use this if you want to open the project in Xcode, edit native code, or archive and upload from Xcode.

### Generate the iOS project

From the project root:

```bash
npx expo prebuild --platform ios
```

This creates an `ios/` folder and an Xcode workspace: `ios/ferbertimer.xcworkspace`.

### Open in Xcode

1. Open **`ios/ferbertimer.xcworkspace`** in Xcode (use the `.xcworkspace` file, not the `.xcodeproj`).
2. In the project navigator, select the **ferbertimer** project (blue icon).
3. Select the **ferbertimer** target → **Signing & Capabilities**.
4. Choose your **Team** and ensure **Automatically manage signing** is enabled (or set provisioning profiles manually).
5. Confirm the **Bundle Identifier** is `com.ferbertimer.app` (or whatever you set in `app.json`).

### Run on device or simulator

- Select a simulator or a connected device and press **Run** (▶).
- Or from the repo root: `npm run ios` (uses Expo dev server; no need to open Xcode for development).

### Archive and upload to TestFlight

1. In Xcode, set the run destination to **Any iOS Device (arm64)**.
2. **Product** → **Archive**.
3. When the Organizer appears, select the archive → **Distribute App**.
4. Choose **App Store Connect** → **Upload**.
5. Follow the wizard (signing, options). When the upload finishes, the build will appear in App Store Connect and then in TestFlight after processing (often 10–15 minutes).

### Re-running prebuild

If you change `app.json` (e.g. version, bundle ID, icons), regenerate the native project:

```bash
npx expo prebuild --platform ios --clean
```

Then open `ios/ferbertimer.xcworkspace` again. If you’ve edited native code in `ios/`, consider committing those changes or using a patch tool so they aren’t lost when re-running prebuild.

---

## Version and build number

- **Version** (`expo.version` in `app.json`, e.g. `1.0.0`) — user-facing; change when you release a new version (e.g. 1.0.1, 1.1.0).
- **Build number** (`expo.ios.buildNumber`) — must increase for every upload to TestFlight/App Store. Bump it in `app.json` before each new build you submit (e.g. `"1"`, `"2"`, `"3"`).

After changing `app.json`, run `npx expo prebuild --platform ios --clean` again if you use the Xcode path; EAS Build picks up `app.json` automatically.

---

## Troubleshooting

- **“No valid code signing”** — In Xcode, set your Team under **Signing & Capabilities** and ensure the bundle ID matches an App ID in your Apple Developer account.
- **“App not found” on submit** — Create the app in App Store Connect with the same bundle ID and set `ascAppId` in `eas.json`.
- **Build fails on EAS** — Check [expo.dev/build](https://expo.dev/build) for the build log; often it’s a dependency or Node/Expo version issue. Ensure `package.json` and `app.json` are valid.

- **App icon doesn't appear on device** — EAS can cache native assets. After changing `assets/icon.png` (or other app icons), either run the build with cache cleared: `eas build --platform ios --profile production --clear-cache` (add `--auto-submit` if you use it), or bump the cache key in `eas.json` under `build.production.cache.key` (e.g. to `assets-v3`). Then delete the app from the device and install the new build; iOS sometimes caches the old icon. Icons should be 1024×1024 PNG.

For more detail: [Expo – Submit to the Apple App Store](https://docs.expo.dev/submit/ios/) and [EAS Build](https://docs.expo.dev/build/introduction).
