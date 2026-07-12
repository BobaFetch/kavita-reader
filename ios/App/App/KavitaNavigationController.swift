import UIKit
import Capacitor

class KavitaNavigationController: CAPBridgeViewController {
    private let contentView = UIView()
    private let navigationToolbar = UIToolbar()

    override func viewDidLoad() {
        super.viewDidLoad()
        guard configureContentView() else {
            return
        }
        configureNavigationToolbar()
    }

    private func configureContentView() -> Bool {
        guard let webView else {
            return false
        }

        view = UIView(frame: view.frame)
        view.backgroundColor = .systemBackground

        contentView.translatesAutoresizingMaskIntoConstraints = false
        navigationToolbar.translatesAutoresizingMaskIntoConstraints = false
        webView.translatesAutoresizingMaskIntoConstraints = false

        view.addSubview(contentView)
        contentView.addSubview(webView)

        NSLayoutConstraint.activate([
            contentView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            contentView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            webView.topAnchor.constraint(equalTo: contentView.topAnchor),
            webView.bottomAnchor.constraint(equalTo: contentView.bottomAnchor),
        ])

        return true
    }

    private func configureNavigationToolbar() {
        navigationToolbar.items = [
            UIBarButtonItem(title: NSLocalizedString("Back", comment: "Navigate back in the Kavita web view"), style: .plain, target: self, action: #selector(goBack)),
            UIBarButtonItem.flexibleSpace(),
            UIBarButtonItem(title: NSLocalizedString("Reload", comment: "Reload the current Kavita web view page"), style: .plain, target: self, action: #selector(reloadPage)),
        ]

        view.addSubview(navigationToolbar)

        NSLayoutConstraint.activate([
            navigationToolbar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            navigationToolbar.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            navigationToolbar.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            contentView.bottomAnchor.constraint(equalTo: navigationToolbar.topAnchor),
        ])
    }

    @objc private func goBack() {
        if webView?.canGoBack == true {
            webView?.goBack()
        }
    }

    @objc private func reloadPage() {
        webView?.reload()
    }
}
