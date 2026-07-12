import { describe, expect, it } from 'vitest';
import { buildConfigXml } from './restrict-cordova-access.mjs';

describe('buildConfigXml', () => {
  it('escapes origins before writing XML attributes', () => {
    expect(buildConfigXml(['https://kavita.example.com/?next=1&label="<Library>"'])).toContain(
      '<access origin="https://kavita.example.com/?next=1&amp;label=&quot;&lt;Library&gt;&quot;" />'
    );
  });
});
