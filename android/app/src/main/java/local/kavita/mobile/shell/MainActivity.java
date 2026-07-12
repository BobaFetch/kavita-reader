package local.kavita.mobile.shell;

import android.os.Bundle;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

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
  }

}
