package local.kavita.mobile.shell;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    enterImmersiveMode();

    getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
      @Override
      public void handleOnBackPressed() {
        WebView webView = getBridge().getWebView();

        if (webView != null && webView.canGoBack()) {
          webView.goBack();
          return;
        }

        setEnabled(false);
        getOnBackPressedDispatcher().onBackPressed();
        setEnabled(true);
      }
    });

    android.widget.Button reload = new android.widget.Button(this);
    reload.setText(getString(R.string.reload));
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
    int margin = Math.round(24 * getResources().getDisplayMetrics().density);
    params.setMargins(0, 0, margin, margin);
    addContentView(reload, params);
    reload.setOnApplyWindowInsetsListener((view, insets) -> {
      int rightInset;
      int bottomInset;
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
        android.graphics.Insets navigationBars = insets.getInsets(android.view.WindowInsets.Type.navigationBars());
        rightInset = navigationBars.right;
        bottomInset = navigationBars.bottom;
      } else {
        rightInset = insets.getSystemWindowInsetRight();
        bottomInset = insets.getSystemWindowInsetBottom();
      }
      params.setMargins(0, 0, margin + rightInset, margin + bottomInset);
      view.setLayoutParams(params);
      return insets;
    });
    reload.requestApplyInsets();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);

    if (hasFocus) {
      enterImmersiveMode();
    }
  }

  private void enterImmersiveMode() {
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
      getWindow().setDecorFitsSystemWindows(false);
      android.view.WindowInsetsController controller = getWindow().getInsetsController();
      if (controller != null) {
        controller.hide(android.view.WindowInsets.Type.statusBars() | android.view.WindowInsets.Type.navigationBars());
        controller.setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
      }
      return;
    }

    getWindow().getDecorView().setSystemUiVisibility(
      android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        | android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
        | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        | android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | android.view.View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        | android.view.View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    );
  }

}
