import { afterEach, describe, expect, it, vi } from 'vitest';

async function loadConfigWithEmptyEnv() {
  vi.resetModules();
  vi.stubEnv('VITE_KAVITA_URL', '');

  const { default: config } = await import('./capacitor.config');
  return config;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Capacitor config', () => {
  it('starts from the bundled app instead of a direct server URL', async () => {
    const config = await loadConfigWithEmptyEnv();

    expect(config.server).not.toHaveProperty('url');
  });

  it('does not default to wildcard native navigation without explicit opt-in', async () => {
    const config = await loadConfigWithEmptyEnv();

    expect(config.server?.allowNavigation).toEqual([]);
  });
});
