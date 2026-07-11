# Boox E-Ink Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve Boox reading comfort with e-ink-friendly defaults and hardware/page-turn key support.

**Architecture:** Keep this Android-only. Add key handling in `MainActivity` that maps volume/page keys to JavaScript keyboard events or WebView scroll/navigation actions, and reduce Android window animations where possible.

**Tech Stack:** Android Java, Capacitor WebView, Boox Android 12 device testing.

---

## File Structure

- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java` - key handling and e-ink window preferences.
- Modify: `README.md` - document Boox controls.

## Task 1: Hardware Key Mapping

**Files:**
- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java`

- [ ] **Step 1: Add key handler**

In `onKeyDown`, before returning `super`, add:

```java
if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN || keyCode == KeyEvent.KEYCODE_PAGE_DOWN) {
  WebView webView = getBridge().getWebView();
  if (webView != null) {
    webView.evaluateJavascript("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));", null);
    return true;
  }
}

if (keyCode == KeyEvent.KEYCODE_VOLUME_UP || keyCode == KeyEvent.KEYCODE_PAGE_UP) {
  WebView webView = getBridge().getWebView();
  if (webView != null) {
    webView.evaluateJavascript("document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));", null);
    return true;
  }
}
```

- [ ] **Step 2: Build**

Run from `android/`: `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug`

Expected: `BUILD SUCCESSFUL`.

## Task 2: Disable Activity Animations

**Files:**
- Modify: `android/app/src/main/res/values/styles.xml`

- [ ] **Step 1: Add no-animation style item**

Inside the app theme used by `MainActivity`, add:

```xml
<item name="android:windowAnimationStyle">@null</item>
```

- [ ] **Step 2: Build**

Run from `android/`: `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug`

Expected: `BUILD SUCCESSFUL`.

## Task 3: Manual Acceptance

- [ ] **Step 1: Install on Boox**

Install debug APK with README command.

Expected: install succeeds.

- [ ] **Step 2: Test page buttons**

Open a Kavita manga reader and press Boox page/volume buttons.

Expected: pages move forward/backward or Kavita receives arrow-key navigation.

- [ ] **Step 3: Adjust mapping if needed**

If Kavita ignores arrow keys, change injected JavaScript to click visible next/previous reader controls after inspecting Kavita DOM on-device.
