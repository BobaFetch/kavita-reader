import { describe, expect, it } from 'vitest';
import { buildConfigXml } from './restrict-cordova-access.mjs';

describe('buildConfigXml', () => {
  it('escapes origins before writing XML attributes', () => {
    expect(buildConfigXml(['https://kavita.example.com/?next=1&label="<Library>"'])).toContain(
      '<access origin="https://kavita.example.com/?next=1&amp;label=&quot;&lt;Library&gt;&quot;" />'
    );
  });

  it('generates no Cordova access entries when no native hosts are configured', () => {
    expect(buildConfigXml([])).toBe(`<?xml version='1.0' encoding='utf-8'?>
<widget version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
</widget>
`);
  });
});
