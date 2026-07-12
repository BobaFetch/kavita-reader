import 'dotenv/config';
import type { CapacitorConfig } from '@capacitor/cli';
import { normalizeKavitaUrl } from './src/kavita-url';

const configuredKavitaUrl = process.env.VITE_KAVITA_URL?.trim()
  ? normalizeKavitaUrl(process.env.VITE_KAVITA_URL)
  : undefined;
const parsedKavitaUrl = configuredKavitaUrl ? new URL(configuredKavitaUrl) : undefined;
const allowNavigation = [parsedKavitaUrl?.hostname].filter(
  (host): host is string => Boolean(host),
);

const config: CapacitorConfig = {
  appId: 'local.kavita.mobile.shell',
  appName: 'Kavita Mobile Shell',
  webDir: 'dist',
  server: {
    allowNavigation,
    cleartext: parsedKavitaUrl?.protocol === 'http:',
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
