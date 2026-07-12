import { describe, expect, it } from 'vitest';
import config from './capacitor.config';

describe('Capacitor config', () => {
  it('starts from the bundled app instead of a direct server URL', () => {
    expect(config.server).not.toHaveProperty('url');
  });

  it('defaults to wildcard native navigation for runtime-configured Kavita URLs', () => {
    expect(config.server?.allowNavigation).toEqual(['*']);
  });
});
