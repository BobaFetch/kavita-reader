# Fullscreen Immersive Implementation Plan

_Executed 2026-07-12. Android/iOS builds passed; Boox and iOS visual acceptance remain manual._

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maximize reading real estate by hiding system bars where appropriate on Android/Boox and iOS.

**Architecture:** Add platform-native fullscreen behavior while keeping Kavita itself unchanged. Android uses guarded WindowInsetsController APIs with a legacy immersive fallback; iOS uses view-controller status bar preferences.

**Tech Stack:** Capacitor Android Java, iOS Swift, Android WindowInsets APIs, UIKit.

---

## File Structure

- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java` - immersive mode.
- Modify: `ios/App/App/AppDelegate.swift` or `ios/App/App/MainViewController.swift` - status bar hiding.
- Modify: `README.md` - document fullscreen behavior.

## Task 1: Android Immersive Mode

**Files:**
- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java`

- [x] **Step 1: Add immersive helper**

Add this method to `MainActivity`. The executed implementation guards API 30+ calls and uses legacy immersive flags below API 30:

```java
private void enterImmersiveMode() {
  getWindow().setDecorFitsSystemWindows(false);
  android.view.WindowInsetsController controller = getWindow().getInsetsController();
  if (controller != null) {
    controller.hide(android.view.WindowInsets.Type.statusBars() | android.view.WindowInsets.Type.navigationBars());
    controller.setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
  }
}
```

- [x] **Step 2: Call helper**

Call `enterImmersiveMode();` after `super.onCreate(savedInstanceState);` and from `onWindowFocusChanged(true)`.

- [x] **Step 3: Build**

Run from `android/`: `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug`

Executed verification used `ANDROID_HOME="$HOME/Library/Android/sdk" JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug` in the fresh worktree.

Expected: `BUILD SUCCESSFUL`.

## Task 2: iOS Hide Status Bar

**Files:**
- Create: `ios/App/App/MainViewController.swift`
- Modify: `ios/App/App/Base.lproj/Main.storyboard`

- [x] **Step 1: Create view controller subclass**

Create `ios/App/App/MainViewController.swift`. The executed implementation subclasses the existing `KavitaNavigationController` to preserve the bottom Back/Reload toolbar:

```swift
class MainViewController: KavitaNavigationController {
    override var prefersStatusBarHidden: Bool {
        return true
    }
}
```

- [x] **Step 2: Set storyboard custom class**

In `ios/App/App/Base.lproj/Main.storyboard`, set the main `viewController` custom class from `KavitaNavigationController` to `MainViewController`, and add `MainViewController.swift` to the App target sources.

- [x] **Step 3: Build iOS**

Run: `xcodebuild -project "ios/App/App.xcodeproj" -scheme App -configuration Debug -sdk iphonesimulator -destination "platform=iOS Simulator,name=iPhone 17" build`

Expected: `** BUILD SUCCEEDED **`.

## Task 3: Acceptance

- [ ] **Step 1: Boox visual test**

Launch app on Boox.

Expected: status/navigation bars are hidden or transient, and Kavita remains usable.

- [ ] **Step 2: iOS visual test**

Launch app in simulator or on device.

Expected: app avoids browser chrome and hides the status bar.
