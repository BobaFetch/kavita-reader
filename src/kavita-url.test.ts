import { describe, expect, it } from 'vitest';
import { getKavitaUrl, normalizeKavitaUrl } from './kavita-url';

describe('normalizeKavitaUrl', () => {
  it('trims whitespace and removes trailing slash', () => {
    expect(normalizeKavitaUrl('  http://198.51.100.10:5000/  ')).toBe('http://198.51.100.10:5000');
  });

  it('preserves an https URL without a trailing slash', () => {
    expect(normalizeKavitaUrl('https://kavita.example.com')).toBe('https://kavita.example.com');
  });

  it('rejects an empty URL', () => {
    expect(() => normalizeKavitaUrl('')).toThrow('VITE_KAVITA_URL is required');
  });

  it('rejects unsupported URL protocols', () => {
    expect(() => normalizeKavitaUrl('ftp://kavita.example.com')).toThrow('Kavita URL must start with http:// or https://');
  });
});

describe('getKavitaUrl', () => {
  it('reads the URL from a provided environment object', () => {
    expect(getKavitaUrl({ VITE_KAVITA_URL: 'http://198.51.100.20:5000/' })).toBe('http://198.51.100.20:5000');
  });
});
