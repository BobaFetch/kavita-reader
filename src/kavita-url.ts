export type KavitaEnv = {
  readonly VITE_KAVITA_URL?: string;
};

export function normalizeKavitaUrl(rawUrl: string | undefined): string {
  const trimmedUrl = rawUrl?.trim();

  if (!trimmedUrl) {
    throw new Error('VITE_KAVITA_URL is required');
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    throw new Error('VITE_KAVITA_URL must be a valid URL');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Kavita URL must start with http:// or https://');
  }

  return trimmedUrl.replace(/\/+$/, '');
}

export function getKavitaUrl(env: KavitaEnv): string {
  return normalizeKavitaUrl(env.VITE_KAVITA_URL);
}
