export type KavitaEnv = {
  readonly VITE_KAVITA_URL?: string;
};

export function normalizeKavitaUrl(rawUrl: string | undefined): string {
  let trimmedUrl = rawUrl?.trim();

  if (!trimmedUrl) {
    throw new Error('Kavita URL is required');
  }

  trimmedUrl = trimmedUrl.replace(/^(https?)\/\//i, '$1://');

  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmedUrl)) {
    trimmedUrl = `https://${trimmedUrl}`;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    throw new Error('Kavita URL must be a valid URL');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Kavita URL must start with http:// or https://');
  }

  return trimmedUrl.replace(/\/+$/, '');
}

export function getNativeAllowedOrigins(env: KavitaEnv): readonly string[] {
  const origins = new Set<string>();

  if (env.VITE_KAVITA_URL?.trim()) {
    origins.add(new URL(normalizeKavitaUrl(env.VITE_KAVITA_URL)).origin);
  }

  return [...origins];
}

export function assertKavitaUrlAllowedByNativeConfig(rawUrl: string, env: KavitaEnv): string {
  const kavitaUrl = normalizeKavitaUrl(rawUrl);
  const allowedOrigins = getNativeAllowedOrigins(env);
  const kavitaProtocol = new URL(kavitaUrl).protocol;

  if (kavitaProtocol === 'http:' && env.VITE_KAVITA_URL?.trim()) {
    const configuredUrl = new URL(normalizeKavitaUrl(env.VITE_KAVITA_URL));
    if (configuredUrl.protocol !== 'http:' || configuredUrl.origin !== new URL(kavitaUrl).origin) {
      throw new Error('Kavita URL must match a native host allowed for this app build');
    }
  }

  if (kavitaProtocol === 'http:' && !env.VITE_KAVITA_URL?.trim()) {
    throw new Error('Kavita URL must use https:// for this app build');
  }

  if (!allowedOrigins.length) {
    throw new Error('Kavita URL must match a native host allowed for this app build');
  }

  if (!allowedOrigins.includes(new URL(kavitaUrl).origin)) {
    throw new Error('Kavita URL must match a native host allowed for this app build');
  }

  return kavitaUrl;
}

export function getKavitaUrl(env: KavitaEnv): string {
  return normalizeKavitaUrl(env.VITE_KAVITA_URL);
}
