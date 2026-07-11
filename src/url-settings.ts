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
