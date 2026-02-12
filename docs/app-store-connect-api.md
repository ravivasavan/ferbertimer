# App Store Connect API setup (EAS Submit)

Use an **App Store Connect API key** so you can upload builds with `eas submit` without entering your Apple ID or app-specific password. Required for CI/CD and convenient for local uploads.

## 1. Create the API key in App Store Connect

1. Sign in at [App Store Connect](https://appstoreconnect.apple.com) and open **Users and Access**.
2. Go to the **Keys** tab (under **Integrations**).
3. Click the **+** button to generate a new key.
4. **Name**: e.g. `EAS Submit` or `Ferber Timer CI`.
5. **Access**: enable **App Manager** (needed to submit builds to TestFlight/App Store).
6. Click **Generate**.
7. **Download the key once** — you get a `.p8` file (e.g. `AuthKey_XXXXXXXXXX.p8`). Apple does not let you download it again.
8. Note these three values (you’ll need them in the next step):
   - **Key ID** — shown on the key row (e.g. `SFB993FB5F`).
   - **Issuer ID** — at the top of the Keys page (UUID format).
   - **Path to the .p8 file** — e.g. `./credentials/AuthKey_XXXXXXXXXX.p8`.

Store the `.p8` file somewhere safe and **never commit it to git**. This repo’s `.gitignore` already ignores `*.p8` and `credentials/`.

## 2. Configure EAS to use the API key

You can use either **eas.json** or **environment variables**.

### Option A: eas.json (local / repo config)

1. Put the `.p8` file in a folder that is not committed, e.g. `credentials/` in the project root (and add `credentials/` to `.gitignore` if needed).
2. In **eas.json**, under your iOS submit profile, add the three API key fields:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "QMSUBPG3D5",
        "ascApiKeyPath": "./credentials/AuthKey_XXXXXXXXXX.p8",
        "ascApiKeyIssuerId": "your-issuer-id-uuid",
        "ascApiKeyId": "YOUR_KEY_ID"
      }
    }
  }
}
```

Replace:

- `ascApiKeyPath` — path to your `.p8` file (relative to the project root or absolute).
- `ascApiKeyIssuerId` — Issuer ID from the Keys page.
- `ascApiKeyId` — Key ID of the key you created.

**Security:** Do not commit the `.p8` file or real issuer/key IDs if the repo is public. Use env vars (Option B) or a private repo.

### Option B: Environment variables (CI/CD or secure local use)

Set these before running `eas submit` (or in your CI environment):

| Variable | Description |
|----------|-------------|
| `EXPO_ASC_API_KEY_PATH` | Path to the `.p8` file |
| `EXPO_ASC_KEY_ID` | Key ID |
| `EXPO_ASC_ISSUER_ID` | Issuer ID |

Example (local):

```bash
export EXPO_ASC_API_KEY_PATH=./credentials/AuthKey_XXXXXXXXXX.p8
export EXPO_ASC_KEY_ID=YOUR_KEY_ID
export EXPO_ASC_ISSUER_ID=your-issuer-id-uuid
eas submit --platform ios --profile production
```

In GitHub Actions (or similar), store the `.p8` contents as a secret, write them to a temp file, and set `EXPO_ASC_API_KEY_PATH` to that path.

## 3. Upload a build

Your **ascAppId** is already set in `eas.json` (`QMSUBPG3D5`). After the API key is configured:

```bash
# If you don’t have a build yet: build then submit
eas build --platform ios --profile production
eas submit --platform ios --profile production

# Or build and submit in one step
eas build --platform ios --profile production --auto-submit
```

EAS will use the App Store Connect API key for submission and will not prompt for Apple ID or app-specific password.

## Alternative: EAS credentials (interactive)

To let EAS store and manage the API key for you:

```bash
eas credentials --platform ios
```

Then choose the **production** profile and **App Store Connect: Manage your API Key** → **Set up your project to use an API Key for EAS Submit**. Follow the prompts (you can create a new key or use an existing one). EAS will save the key on EAS servers and use it for submits.

## Troubleshooting

- **“Unable to authenticate”** — Check Key ID, Issuer ID, and that the `.p8` path is correct and the file exists.
- **“App not found” / invalid app** — Confirm `ascAppId` in `eas.json` matches the app’s Apple ID in App Store Connect (App Information → General → Apple ID).
- **Permission errors** — The key must have **App Manager** (or Admin) access to submit builds.

For more: [Expo – Submit to the Apple App Store](https://docs.expo.dev/submit/ios/) and [Creating an App Store Connect API Key](https://expo.fyi/creating-asc-api-key).
