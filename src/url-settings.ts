import { assertKavitaUrlAllowedByNativeConfig, normalizeKavitaUrl, type KavitaEnv } from './kavita-url';

export type PreferenceStore = {
  readonly get: (options: { readonly key: string }) => Promise<{ readonly value: string | null }>;
  readonly set: (options: { readonly key: string; readonly value: string }) => Promise<void>;
};

export const KAVITA_URL_KEY = 'kavitaUrl';

export async function getSavedKavitaUrl(store: PreferenceStore, env?: KavitaEnv): Promise<string | null> {
  const result = await store.get({ key: KAVITA_URL_KEY });
  return result.value ? (env ? assertKavitaUrlAllowedByNativeConfig(result.value, env) : normalizeKavitaUrl(result.value)) : null;
}

export async function saveKavitaUrl(store: PreferenceStore, rawUrl: string, env?: KavitaEnv): Promise<string> {
  const value = env ? assertKavitaUrlAllowedByNativeConfig(rawUrl, env) : normalizeKavitaUrl(rawUrl);
  await store.set({ key: KAVITA_URL_KEY, value });
  return value;
}
