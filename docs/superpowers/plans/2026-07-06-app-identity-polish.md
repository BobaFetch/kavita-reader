# App Identity Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename and visually polish the app so it feels like a dedicated Kavita reader rather than a generated Capacitor sample.

**Architecture:** Update app display names, bundle metadata, icons, splash assets, and README references without changing runtime WebView behavior.

**Tech Stack:** Capacitor config, Android resources, iOS Xcode assets, Vite static assets.

---

## File Structure

- Modify: `capacitor.config.ts` - app name.
- Modify: `android/app/src/main/res/values/strings.xml` - Android app label.
- Modify: `ios/App/App/Info.plist` - display name if generated value is insufficient.
- Replace: Android launcher icons under `android/app/src/main/res/mipmap-*`.
- Replace: iOS app icon assets under `ios/App/App/Assets.xcassets/AppIcon.appiconset`.
- Modify: `README.md` - new name and icon notes.

## Task 1: Rename App

- [ ] **Step 1: Update Capacitor app name**

Change `capacitor.config.ts`:

```ts
appName: 'Kavita Reader',
```

- [ ] **Step 2: Update Android label**

Set `android/app/src/main/res/values/strings.xml` app name to:

```xml
<string name="app_name">Kavita Reader</string>
<string name="title_activity_main">Kavita Reader</string>
```

- [ ] **Step 3: Sync/build**

Run: `npm run cap:sync`

Run from `android/`: `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug`

Expected: build succeeds.

## Task 2: Generate Icons

- [ ] **Step 1: Create source icon**

Create `resources/icon.svg` with a simple monochrome book mark:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" rx="220" fill="#0f172a"/>
  <path d="M270 220h310c96 0 174 78 174 174v410H444c-96 0-174-78-174-174V220Z" fill="#f8fafc"/>
  <path d="M420 330h210v72H420v-72Zm0 142h210v72H420v-72Z" fill="#0f172a"/>
</svg>
```

- [ ] **Step 2: Generate platform icons**

Use an icon generation tool such as `@capacitor/assets`:

Run: `npm install -D @capacitor/assets`

Run: `npx capacitor-assets generate --iconBackgroundColor '#0f172a' --splashBackgroundColor '#0f172a'`

Expected: Android and iOS icon assets are regenerated.

## Task 3: Verify

- [ ] **Step 1: Android install**

Install on Boox.

Expected: launcher label is `Kavita Reader` and icon is updated.

- [ ] **Step 2: iOS build**

Run: `xcodebuild -project "ios/App/App.xcodeproj" -scheme App -configuration Debug -sdk iphonesimulator -destination "platform=iOS Simulator,name=iPhone 17" build`

Expected: `** BUILD SUCCEEDED **`.
