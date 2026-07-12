# Kavita Mobile Shell

Capacitor shell for Kavita without browser chrome. The app points the native WebView at the configured Kavita URL and lets Kavita handle login and sessions.

## Kavita URL

The app asks for the Kavita server URL on first launch and saves it on-device. For local setup, use your own Kavita URL:

```env
VITE_KAVITA_URL=https://kavita-library.example.dev/
```

If your main Kavita hostname uses an external access flow that hands off to another app, use an app-specific hostname that reaches the Kavita login directly.

To change the server later, clear the app's stored data or uninstall and reinstall the app, then enter the new URL on first launch.

## Setup

Install dependencies:

```sh
npm install
```

Configure `.env` from `.env.example` for native navigation allow-listing:

```env
VITE_KAVITA_URL=https://kavita-library.example.dev/
VITE_CAPACITOR_ALLOW_NAVIGATION=example.cloudflareaccess.com
```

`VITE_KAVITA_URL` is optional for startup now; it is used by native config to include the host in Capacitor `allowNavigation`. The app's runtime URL comes from the saved on-device setting and must match a host allowed for that native build.

For production builds, set `VITE_CAPACITOR_ALLOW_NAVIGATION` to the exact Kavita and external auth hosts that must stay inside the app. Use `VITE_CAPACITOR_ALLOW_NAVIGATION=*` only for runtime-configured builds that intentionally allow arbitrary Kavita hosts.

## Test And Build

Run tests:

```sh
npm test
```

Build the web app:

```sh
npm run build
```

Sync Capacitor native projects:

```sh
npm run cap:sync
```

## Android / Boox

Android uses the system Back button to navigate backward inside the Kavita WebView before exiting the app. A small floating Reload button appears at the bottom-right of the app and reloads the current Kavita page. The app runs fullscreen on Android/Boox by hiding the status and navigation bars, with transient system bars where supported and a legacy immersive fallback.

Build a debug APK from `android/` using Android Studio's bundled JBR:

```sh
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug
```

Install the debug APK from the project root using the discovered Android SDK path:

```sh
"$ANDROID_HOME/platform-tools/adb" install -r android/app/build/outputs/apk/debug/app-debug.apk
```

If Boox disables the sideloaded package, enable it:

```sh
"$ANDROID_HOME/platform-tools/adb" shell pm enable local.kavita.mobile.shell
```

Launch the app activity:

```sh
"$ANDROID_HOME/platform-tools/adb" shell am start -n local.kavita.mobile.shell/.MainActivity
```

Boox is Android v1 for this project.

## iOS

iOS hides the status bar for a fullscreen reading surface while keeping the bottom toolbar with Back and Reload controls for the Kavita WebView.

Open the iOS project in Xcode:

```sh
npm run cap:open:ios
```

Terminal build was verified with Xcode 26.6 for an iPhone 17 simulator. GUI login and session verification is manual.

## Notes

- The app does not store credentials.
- WebView/Kavita handles sessions.
- Boox may disable the sideloaded package; `pm enable local.kavita.mobile.shell` fixes it.
