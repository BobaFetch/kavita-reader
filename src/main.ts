import './styles.css';
import { Preferences } from '@capacitor/preferences';
import type { KavitaEnv } from './kavita-url';
import { getSavedKavitaUrl, saveKavitaUrl, type PreferenceStore } from './url-settings';

type LauncherOptions = {
  readonly kavitaUrl: string;
  readonly navigate: (url: string) => void;
};

type SettingsOptions = {
  readonly save: (url: string) => Promise<string>;
  readonly navigate: (url: string) => void;
};

type ShellOptions = {
  readonly store: PreferenceStore;
  readonly env?: KavitaEnv;
  readonly navigate: (url: string) => void;
};

function escapeHtml(value: string): string {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

export function renderKavitaLauncher(root: HTMLElement, options: LauncherOptions): void {
  const escapedUrl = escapeHtml(options.kavitaUrl);

  root.innerHTML = `
    <section class="shell" aria-labelledby="launcher-title">
      <div class="panel">
        <h1 class="title" id="launcher-title">Opening Kavita</h1>
        <p class="message">Loading ${escapedUrl} in the app shell.</p>
        <div class="actions">
          <button class="button" type="button">Retry</button>
        </div>
      </div>
    </section>
  `;

  root.querySelector('button')?.addEventListener('click', () => {
    options.navigate(options.kavitaUrl);
  });

  window.setTimeout(() => options.navigate(options.kavitaUrl), 100);
}

export function renderConfigurationError(root: HTMLElement, error: unknown): void {
  const message = error instanceof Error ? error.message : 'Unknown configuration error';

  root.innerHTML = `
    <section class="shell" aria-labelledby="error-title">
      <div class="panel">
        <h1 class="title" id="error-title">Kavita URL Missing</h1>
        <p class="message">${escapeHtml(message)}</p>
      </div>
    </section>
  `;
}

export function renderUrlSettings(root: HTMLElement, options: SettingsOptions): void {
  root.innerHTML = `
    <section class="shell" aria-labelledby="settings-title">
      <form class="panel form" aria-label="Kavita settings">
        <h1 class="title" id="settings-title">Kavita URL</h1>
        <p class="message">Enter the Kavita server URL to open in this app.</p>
        <label class="field">
          <span>Server URL</span>
          <input class="input" name="kavitaUrl" type="text" inputmode="url" required placeholder="https://kavita-library.example.dev" />
        </label>
        <div class="actions"><button class="button" type="submit">Save and Open</button></div>
      </form>
    </section>
  `;

  root.querySelector('form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const savedUrl = await options.save(String(formData.get('kavitaUrl') ?? ''));
    options.navigate(savedUrl);
  });
}

export async function startKavitaShell(root: HTMLElement, options: ShellOptions): Promise<void> {
  try {
    const kavitaUrl = await getSavedKavitaUrl(options.store, options.env);

    if (kavitaUrl) {
      renderKavitaLauncher(root, { kavitaUrl, navigate: options.navigate });
      return;
    }

    renderUrlSettings(root, {
      save: (url) => saveKavitaUrl(options.store, url, options.env),
      navigate: options.navigate,
    });
  } catch (error) {
    renderConfigurationError(root, error);
  }
}

const app = document.querySelector<HTMLDivElement>('#app');

if (!app && import.meta.env.MODE !== 'test') {
  throw new Error('App root #app was not found');
}

if (app) {
  void startKavitaShell(app, {
    store: Preferences,
    env: {
      VITE_KAVITA_URL: import.meta.env.VITE_KAVITA_URL,
      VITE_CAPACITOR_ALLOW_NAVIGATION: import.meta.env.VITE_CAPACITOR_ALLOW_NAVIGATION,
    },
    navigate: (url) => {
      window.location.replace(url);
    },
  });
}
