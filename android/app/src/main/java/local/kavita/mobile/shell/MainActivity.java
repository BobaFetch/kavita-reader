package local.kavita.mobile.shell;

import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

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
