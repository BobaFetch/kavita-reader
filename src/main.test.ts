import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderKavitaLauncher, renderUrlSettings, startKavitaShell } from './main';
import type { PreferenceStore } from './url-settings';

describe('renderKavitaLauncher', () => {
  let root: HTMLDivElement;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    root = document.createElement('div');
    navigate = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the opening state before navigating to Kavita', () => {
    renderKavitaLauncher(root, {
      kavitaUrl: 'http://198.51.100.10:5000',
      navigate,
    });

    expect(root.textContent).toContain('Opening Kavita');
    expect(root.textContent).toContain('http://198.51.100.10:5000');
    expect(navigate).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(navigate).toHaveBeenCalledWith('http://198.51.100.10:5000');
  });

  it('renders a retry button that navigates again', () => {
    renderKavitaLauncher(root, {
      kavitaUrl: 'https://kavita.example.com',
      navigate,
    });

    const retryButton = root.querySelector<HTMLButtonElement>('button');

    expect(retryButton).not.toBeNull();

    retryButton?.click();

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenLastCalledWith('https://kavita.example.com');

    vi.runAllTimers();

    expect(navigate).toHaveBeenCalledTimes(2);
  });
});

describe('renderUrlSettings', () => {
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
});

describe('startKavitaShell', () => {
  it('shows settings when no URL is saved', async () => {
    const root = document.createElement('div');
    const store: PreferenceStore = { get: vi.fn().mockResolvedValue({ value: null }), set: vi.fn() };

    await startKavitaShell(root, { store, navigate: vi.fn() });

    expect(root.textContent).toContain('Kavita URL');
    expect(root.querySelector('form')).not.toBeNull();
  });

  it('opens the saved URL when one exists', async () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    const navigate = vi.fn();
    const store: PreferenceStore = {
      get: vi.fn().mockResolvedValue({ value: 'https://kavita-library.example.dev/' }),
      set: vi.fn(),
    };

    await startKavitaShell(root, { store, navigate });

    expect(root.textContent).toContain('Opening Kavita');
    vi.runAllTimers();
    expect(navigate).toHaveBeenCalledWith('https://kavita-library.example.dev');
  });
});
