# Kavita Mobile Shell Design

## Goal

Build a first-iteration mobile app for reading from an existing Kavita library without the visible browser chrome that appears in Safari or Chrome on mobile devices.

The first iteration should be intentionally small: a dedicated full-screen app shell that loads the existing Kavita web interface. It should work on iPhone/iPad and Android, including Boox devices treated as standard Android devices for this version.

## Non-Goals

- Do not build a native Kavita client in this iteration.
- Do not implement a custom library browser, search UI, or reader UI.
- Do not integrate directly with Kavita APIs except by loading the existing web UI.
- Do not implement offline downloads.
- Do not add Boox-specific e-ink behavior yet.
- Do not require app store distribution for local testing.

## Recommended Approach

Use Capacitor to create a cross-platform mobile app that wraps Kavita in a native WebView. Capacitor gives us one codebase that can produce iOS and Android projects, while still leaving a path to add native capabilities later.

The first usable version should feel like opening a dedicated Kavita app:

- The user taps an app icon.
- The app opens full screen.
- The app loads the configured Kavita server URL.
- Kavita login and sessions persist inside the app WebView.
- The user reads with Kavita's existing mobile web UI, but without Safari or Chrome address bars, tabs, and browser controls.

## Architecture

The app has three layers:

1. A minimal bundled web app that exists only to bootstrap the shell.
2. A Capacitor native shell for iOS and Android.
3. A WebView that navigates to the configured Kavita server URL.

There is no backend service, database, sync process, or native Kavita API client in v1.

## Configuration

The app should have a single Kavita server URL configured for the initial build. The URL may be a LAN address, VPN address, or public HTTPS address depending on the user's setup.

If the Kavita server uses HTTP or a local-network address, the native platform configuration must allow that intentionally:

- Android may need cleartext traffic enabled for the Kavita host.
- iOS may need App Transport Security exceptions for a local HTTP server.
- iOS may also need local network access behavior considered if the server is only reachable on the LAN.

HTTPS remains preferable when available, but local HTTP should be supported for a personal first iteration.

## User Flow

1. User installs and opens the app.
2. App launches into a full-screen WebView.
3. WebView navigates to the configured Kavita URL.
4. User logs into Kavita using Kavita's existing login screen.
5. Kavita session state persists between app launches through WebView storage.
6. User browses and reads using Kavita's existing web interface.

## Platform Scope

### iOS

The app should run on iPhone and iPad through the Capacitor iOS target. The first iteration is intended for local development/testing rather than App Store release.

### Android and Boox

The app should run on Android through the Capacitor Android target. Boox devices are treated as Android devices in v1. E-ink-specific changes, page-turn buttons, animation reduction, and display tuning are deferred.

## Error Handling

The shell should avoid complex custom error screens in v1. If the Kavita URL is unreachable, the WebView will show the platform's normal navigation error. A simple reload affordance can be added if it is straightforward, but it is not required for the first usable version.

The app should not intercept Kavita authentication or store credentials itself.

## Testing

Manual testing is the primary validation for v1:

- Launches on iOS simulator or device.
- Launches on Android emulator or device.
- Loads the configured Kavita URL.
- Allows Kavita login.
- Preserves login across app restart.
- Displays without mobile browser chrome.
- Navigates library and reader views using Kavita's existing UI.

Boox validation can be done later on physical hardware after the Android build works.

## Future Iterations

After the shell works, future work can move toward a more native reader experience:

- First-run server URL entry and settings screen.
- Native navigation controls.
- Keep-awake and orientation controls.
- Boox/e-ink display tuning.
- Android hardware/page-turn button support.
- Native Kavita API integration.
- Native iOS and Android clients with custom library and reader UIs.
- Offline downloads.

## Open Decisions

Before implementation, decide the initial Kavita URL strategy:

- Hard-code a local development URL for the first build.
- Or add a minimal first-run URL entry screen.

The smallest first iteration is a hard-coded URL, but a URL entry screen may be more convenient if the app will move between devices or networks.
