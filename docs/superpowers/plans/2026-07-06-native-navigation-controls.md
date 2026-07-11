# Native Navigation Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add native back, forward, reload, and settings controls around the Kavita WebView without making it feel like a general browser.

**Architecture:** Use a small native bridge surface rather than rebuilding Kavita navigation. Android uses a lightweight native toolbar and WebView history APIs; iOS uses a matching toolbar in the generated Capacitor view controller.

**Tech Stack:** Capacitor Android, Kotlin/Java Android native code, Swift iOS native code, Capacitor WebView.

---

## File Structure

- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java` - Android toolbar and WebView navigation actions.
- Modify: `ios/App/App/AppDelegate.swift` or create `ios/App/App/KavitaNavigationController.swift` - iOS toolbar and WebView navigation actions.
- Modify: `README.md` - document controls.

## Task 1: Android Back And Reload Controls

**Files:**
- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java`

- [ ] **Step 1: Inspect current activity**

Read `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java`.

Expected baseline:

```java
package local.kavita.mobile.shell;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
```

- [ ] **Step 2: Implement Android hardware back behavior**

Replace file with:

```java
package local.kavita.mobile.shell;

import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    WebView webView = getBridge().getWebView();

    if (keyCode == KeyEvent.KEYCODE_BACK && webView != null && webView.canGoBack()) {
      webView.goBack();
      return true;
    }

    return super.onKeyDown(keyCode, event);
  }
}
```

- [ ] **Step 3: Build Android**

Run from `android/`: `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug`

Expected: `BUILD SUCCESSFUL`.

## Task 2: Android Floating Reload Button

**Files:**
- Modify: `android/app/src/main/java/local/kavita/mobile/shell/MainActivity.java`

- [ ] **Step 1: Add reload action**

Extend `onCreate` with a small `Button` anchored to the bottom-right that calls `getBridge().getWebView().reload()`.

Use this exact implementation inside `onCreate` after `super.onCreate(savedInstanceState);`:

```java
android.widget.Button reload = new android.widget.Button(this);
reload.setText("Reload");
reload.setOnClickListener((view) -> {
  WebView webView = getBridge().getWebView();
  if (webView != null) {
    webView.reload();
  }
});

android.widget.FrameLayout.LayoutParams params = new android.widget.FrameLayout.LayoutParams(
  android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
  android.widget.FrameLayout.LayoutParams.WRAP_CONTENT,
  android.view.Gravity.BOTTOM | android.view.Gravity.END
);
params.setMargins(0, 0, 24, 24);
addContentView(reload, params);
```

- [ ] **Step 2: Build Android**

Run from `android/`: `JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug`

Expected: `BUILD SUCCESSFUL`.

## Task 3: iOS Toolbar Controls

**Files:**
- Modify: `ios/App/App/AppDelegate.swift`

- [ ] **Step 1: Add iOS toolbar only after Android behavior is accepted**

Add a `UIToolbar` to the root view controller with Back and Reload buttons that call `webView.goBack()` and `webView.reload()` on the Capacitor bridge web view.

- [ ] **Step 2: Build iOS simulator**

Run: `xcodebuild -project "ios/App/App.xcodeproj" -scheme App -configuration Debug -sdk iphonesimulator -destination "platform=iOS Simulator,name=iPhone 17" build`

Expected: `** BUILD SUCCEEDED **`.

## Task 4: Acceptance

- [ ] **Step 1: Android manual test**

Install on Boox, open Kavita, navigate to a series, press system Back.

Expected: Kavita navigates back inside WebView before exiting the app.

- [ ] **Step 2: Reload manual test**

Tap Reload.

Expected: current Kavita page reloads without opening Chrome.
