import { describe, expect, it } from 'vitest';
import { assertKavitaUrlAllowedByNativeConfig, getKavitaUrl, getNativeAllowedOrigins, normalizeKavitaUrl } from './kavita-url';

describe('normalizeKavitaUrl', () => {
  it('trims whitespace and removes trailing slash', () => {
    expect(normalizeKavitaUrl('  http://198.51.100.10:5000/  ')).toBe('http://198.51.100.10:5000');
  });

  it('preserves an https URL without a trailing slash', () => {
    expect(normalizeKavitaUrl('https://kavita.example.com')).toBe('https://kavita.example.com');
  });

  it('repairs a missing colon in an https URL', () => {
    expect(normalizeKavitaUrl('https//reader.example.com')).toBe('https://reader.example.com');
  });

  it('defaults a bare host to https', () => {
    expect(normalizeKavitaUrl('reader.example.com')).toBe('https://reader.example.com');
  });

  it('rejects an empty URL', () => {
    expect(() => normalizeKavitaUrl('')).toThrow('Kavita URL is required');
  });

  it('rejects an invalid URL with user-facing wording', () => {
    expect(() => normalizeKavitaUrl('not a url')).toThrow('Kavita URL must be a valid URL');
  });

  it('rejects unsupported URL protocols', () => {
    expect(() => normalizeKavitaUrl('ftp://kavita.example.com')).toThrow('Kavita URL must start with http:// or https://');
  });
});

describe('assertKavitaUrlAllowedByNativeConfig', () => {
  it('allows a URL that matches the configured Kavita origin', () => {
    expect(assertKavitaUrlAllowedByNativeConfig('https://kavita.example.com/', {
      VITE_KAVITA_URL: 'https://kavita.example.com/',
    })).toBe('https://kavita.example.com');
  });

  it('rejects a URL outside the native allow-list', () => {
    expect(() => assertKavitaUrlAllowedByNativeConfig('https://untrusted.example.com', {
      VITE_KAVITA_URL: 'https://kavita.example.com/',
    })).toThrow('Kavita URL must match a native host allowed for this app build');
  });

  it('rejects cleartext URLs unless the configured Kavita origin is cleartext', () => {
    expect(() => assertKavitaUrlAllowedByNativeConfig('http://kavita.example.com', {
      VITE_KAVITA_URL: 'https://kavita.example.com/',
    })).toThrow('Kavita URL must match a native host allowed for this app build');
  });

  it('allows cleartext URLs when the configured Kavita origin is cleartext', () => {
    expect(assertKavitaUrlAllowedByNativeConfig('http://kavita.example.com/', {
      VITE_KAVITA_URL: 'http://kavita.example.com/',
    })).toBe('http://kavita.example.com');
  });

  it('rejects arbitrary cleartext URLs when wildcard navigation is paired with a cleartext Kavita origin', () => {
    expect(() => assertKavitaUrlAllowedByNativeConfig('http://untrusted.example.com/', {
      VITE_KAVITA_URL: 'http://kavita.example.com/',
      VITE_CAPACITOR_ALLOW_NAVIGATION: '*',
    })).toThrow('Kavita URL must match a native host allowed for this app build');
  });

  it('allows any normalized URL when native navigation uses a wildcard host mask', () => {
    expect(assertKavitaUrlAllowedByNativeConfig('https://reader.example.net/', {
      VITE_CAPACITOR_ALLOW_NAVIGATION: '*',
    })).toBe('https://reader.example.net');
  });

  it('rejects cleartext URLs when native navigation uses a wildcard host mask', () => {
    expect(() => assertKavitaUrlAllowedByNativeConfig('http://reader.example.net/', {
      VITE_CAPACITOR_ALLOW_NAVIGATION: '*',
    })).toThrow('Kavita URL must use https:// for this app build');
  });

  it('rejects runtime URLs when no native navigation hosts are configured', () => {
    expect(() => assertKavitaUrlAllowedByNativeConfig('https://reader.example.net/', {})).toThrow(
      'Kavita URL must match a native host allowed for this app build'
    );
  });
});

describe('getNativeAllowedOrigins', () => {
  it('normalizes allow-list entries without explicit schemes to origins', () => {
    expect(getNativeAllowedOrigins({
      VITE_CAPACITOR_ALLOW_NAVIGATION: 'kavita.example.com/, files.example.com/library',
    })).toEqual(['https://kavita.example.com', 'https://files.example.com']);
  });

  it('preserves wildcard host masks', () => {
    expect(getNativeAllowedOrigins({ VITE_CAPACITOR_ALLOW_NAVIGATION: '*' })).toEqual(['*']);
  });
});

describe('getKavitaUrl', () => {
  it('reads the URL from a provided environment object', () => {
    expect(getKavitaUrl({ VITE_KAVITA_URL: 'http://198.51.100.20:5000/' })).toBe('http://198.51.100.20:5000');
  });
});
