# Settings Screen URL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user change the Kavita URL on-device without editing `.env`, rebuilding, and reinstalling the app.

**Architecture:** Replace native `server.url` as the primary runtime path with a bundled Capacitor web shell that reads a saved URL from Capacitor Preferences. The shell shows a first-run settings form when no URL is saved, then navigates the WebView to the saved Kavita URL.

**Tech Stack:** Vite, TypeScript, Vitest, jsdom, Capacitor Preferences, Capacitor native iOS/Android projects.

---

## File Structure

- Modify: `package.json` - add `@capacitor/preferences` dependency.
- Modify: `capacitor.config.ts` - remove direct `server.url`, keep `allowNavigation` for configured hosts.
- Create: `src/url-settings.ts` - pure helpers for loading, saving, and validating saved URLs.
- Create: `src/url-settings.test.ts` - unit tests for settings helpers.
- Modify: `src/main.ts` - render first-run URL form, save URL, and navigate.
- Modify: `src/main.test.ts` - DOM tests for first-run settings and saved URL launch.
- Modify: `src/styles.css` - form styles.
- Modify: `README.md` - document runtime URL settings.

## Task 1: Add Preferences Dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install dependency**

Run: `npm install @capacitor/preferences`

Expected: `package.json` and `package-lock.json` include `@capacitor/preferences`.

- [ ] **Step 2: Sync native projects**

Run: `npm run cap:sync`

Expected: build passes and Capacitor sync includes the Preferences plugin.

## Task 2: Add Settings Storage Helpers

**Files:**
- Create: `src/url-settings.ts`
- Create: `src/url-settings.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/url-settings.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { getSavedKavitaUrl, saveKavitaUrl, type PreferenceStore } from './url-settings';

describe('url settings', () => {
  it('returns null when no saved URL exists', async () => {
    const store: PreferenceStore = { get: vi.fn().mockResolvedValue({ value: null }), set: vi.fn() };

    await expect(getSavedKavitaUrl(store)).resolves.toBeNull();
  });

  it('normalizes a saved URL', async () => {
    const store: PreferenceStore = { get: vi.fn().mockResolvedValue({ value: ' https://kavita-library.example.dev/ ' }), set: vi.fn() };

    await expect(getSavedKavitaUrl(store)).resolves.toBe('https://kavita-library.example.dev');
  });

  it('saves a normalized URL', async () => {
    const store: PreferenceStore = { get: vi.fn(), set: vi.fn().mockResolvedValue(undefined) };

    await saveKavitaUrl(store, 'https://kavita-library.example.dev/');

    expect(store.set).toHaveBeenCalledWith({ key: 'kavitaUrl', value: 'https://kavita-library.example.dev' });
  });
});
```

- [ ] **Step 2: Run failing tests**

Run: `npm test -- src/url-settings.test.ts`

Expected: FAIL because `src/url-settings.ts` does not exist.

- [ ] **Step 3: Implement helper**

Create `src/url-settings.ts`:

```ts
import { normalizeKavitaUrl } from './kavita-url';

export type PreferenceStore = {
  readonly get: (options: { readonly key: string }) => Promise<{ readonly value: string | null }>;
  readonly set: (options: { readonly key: string; readonly value: string }) => Promise<void>;
};

export const KAVITA_URL_KEY = 'kavitaUrl';

export async function getSavedKavitaUrl(store: PreferenceStore): Promise<string | null> {
  const result = await store.get({ key: KAVITA_URL_KEY });
  return result.value ? normalizeKavitaUrl(result.value) : null;
}

export async function saveKavitaUrl(store: PreferenceStore, rawUrl: string): Promise<string> {
  const value = normalizeKavitaUrl(rawUrl);
  await store.set({ key: KAVITA_URL_KEY, value });
  return value;
}
```

- [ ] **Step 4: Verify tests**

Run: `npm test -- src/url-settings.test.ts`

Expected: PASS.

## Task 3: Render First-Run Settings UI

**Files:**
- Modify: `src/main.ts`
- Modify: `src/main.test.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Add DOM tests**

Extend `src/main.test.ts` with:

```ts
import { renderUrlSettings } from './main';

it('renders a URL settings form and saves a valid URL', async () => {
  const root = document.createElement('div');
  const save = vi.fn().mockResolvedValue('https://kavita-library.example.dev');
  const navigate = vi.fn();

  renderUrlSettings(root, { save, navigate });

  const input = root.querySelector<HTMLInputElement>('input[name="kavitaUrl"]');
  input!.value = 'https://kavita-library.example.dev/';
  root.querySelector<HTMLFormElement>('form')!.requestSubmit();
  await Promise.resolve();

  expect(save).toHaveBeenCalledWith('https://kavita-library.example.dev/');
  expect(navigate).toHaveBeenCalledWith('https://kavita-library.example.dev');
});
```

- [ ] **Step 2: Run failing test**

Run: `npm test -- src/main.test.ts`

Expected: FAIL because `renderUrlSettings` is not exported.

- [ ] **Step 3: Implement settings renderer**

Add to `src/main.ts`:

```ts
type SettingsOptions = {
  readonly save: (url: string) => Promise<string>;
  readonly navigate: (url: string) => void;
};

export function renderUrlSettings(root: HTMLElement, options: SettingsOptions): void {
  root.innerHTML = `
    <section class="shell" aria-labelledby="settings-title">
      <form class="panel form" aria-label="Kavita settings">
        <h1 class="title" id="settings-title">Kavita URL</h1>
        <label class="field">
          <span>Server URL</span>
          <input class="input" name="kavitaUrl" type="url" required placeholder="https://kavita-library.example.dev" />
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
```

Add to `src/styles.css`:

```css
.form {
  text-align: left;
}

.field {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #cbd5e1;
}

.input {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: 0.75rem;
  padding: 0.8rem 0.9rem;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.9);
  font: inherit;
}
```

- [ ] **Step 4: Wire startup**

Update startup in `src/main.ts` so it imports `Preferences`, calls `getSavedKavitaUrl(Preferences)`, shows settings if null, otherwise calls `renderKavitaLauncher`.

- [ ] **Step 5: Verify**

Run: `npm test && npm run build && npm run cap:sync`

Expected: tests pass, build passes, native sync completes.

## Task 4: Update Native Config

**Files:**
- Modify: `capacitor.config.ts`

- [ ] **Step 1: Remove direct native URL startup**

Remove `url: kavitaUrl` from `server` so the bundled app can render the settings screen before navigating.

- [ ] **Step 2: Verify**

Run: `npm test && npm run build && npm run cap:sync`

Expected: all commands pass.

## Task 5: Manual Acceptance

- [ ] **Step 1: Fresh install**

Uninstall app from Boox: `/Users/bobafetch/Library/Android/sdk/platform-tools/adb uninstall local.kavita.mobile.shell`

Expected: package removed.

- [ ] **Step 2: Install and launch**

Build and install the APK using README commands.

Expected: first screen asks for Kavita URL.

- [ ] **Step 3: Save URL**

Enter `https://kavita-library.example.dev/`.

Expected: app opens Kavita and stays in app WebView.

- [ ] **Step 4: Relaunch**

Force stop and relaunch.

Expected: saved URL is reused without showing settings.
