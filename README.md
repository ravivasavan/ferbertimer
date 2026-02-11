# Ferber Method Timer

A simple React Native (Expo) web app for tracking Ferber method sleep-training check-in intervals.

## Features

- **Days 1–7** with the standard graduated check-in schedule
- **Day 8+** single 30-minute repeating timer
- Countdown timer with start, reset, and skip
- Audio alert (3 beeps) when each interval completes
- "Check-in Done" advances to the next longer interval
- Schedule overview showing your progress through the night

## Ferber Intervals

| Day | 1st | 2nd | 3rd | Subsequent |
|-----|-----|-----|-----|------------|
| 1   | 3 min | 5 min | 10 min | 10 min |
| 2   | 5 min | 10 min | 12 min | 12 min |
| 3   | 10 min | 12 min | 15 min | 15 min |
| 4   | 12 min | 15 min | 17 min | 17 min |
| 5   | 15 min | 17 min | 20 min | 20 min |
| 6   | 17 min | 20 min | 25 min | 25 min |
| 7   | 20 min | 25 min | 30 min | 30 min |
| 8+  | 30 min | — | — | — |

## Local Setup

```bash
git clone <repo-url> ferbertimer
cd ferbertimer
npm install
npm run web
```

Requires **Node 22+**. Expo will open in your browser at `http://localhost:8081`.

## Project Structure

```
App.js          — Entire app (day selector + timer screens)
index.js        — Expo entry point
app.json        — Expo configuration
package.json    — Dependencies and scripts
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run web` | Start the dev server for web |
| `npm run start` | Start Expo dev server (all platforms) |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |

## iOS and TestFlight

The app is set up for Xcode and TestFlight:

- **`app.json`** — `expo.ios.bundleIdentifier` and `buildNumber` are set for App Store / TestFlight.
- **`eas.json`** — EAS Build and submit profiles; set `submit.production.ios.ascAppId` to your App Store Connect app ID.

**Quick TestFlight (no Xcode):** install EAS CLI, then run `npx testflight` to build and submit in one step.

**Xcode workflow:** run `npx expo prebuild --platform ios`, then open `ios/ferbertimer.xcworkspace` in Xcode to archive and upload.

Full steps (credentials, App Store Connect, versioning): **[docs/xcode-testflight.md](docs/xcode-testflight.md)**.
