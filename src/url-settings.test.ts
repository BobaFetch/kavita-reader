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
