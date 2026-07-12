import fs from 'node:fs';

const configPaths = [
  'android/app/src/main/assets/capacitor.config.json',
  'ios/App/App/capacitor.config.json',
];

const xmlPaths = [
  'android/app/src/main/res/xml/config.xml',
  'ios/App/App/config.xml',
];

function readAllowedOrigins() {
  const configPath = configPaths.find((path) => fs.existsSync(path));

  if (!configPath) {
    throw new Error('Capacitor config was not generated. Run cap sync first.');
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const hosts = config.server?.allowNavigation ?? [];
  const protocols = config.server?.cleartext ? ['https', 'http'] : ['https'];

  return hosts.flatMap((host) => protocols.map((protocol) => `${protocol}://${host}`));
}

function escapeXmlAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function buildConfigXml(origins) {
  const accessEntries = origins.map((origin) => `  <access origin="${escapeXmlAttribute(origin)}" />`).join('\n');

  return `<?xml version='1.0' encoding='utf-8'?>
<widget version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
${accessEntries}
</widget>
`;
}

function main() {
  const origins = readAllowedOrigins();

  if (!origins.length) {
    throw new Error('No native navigation hosts are configured; refusing to generate wildcard Cordova access.');
  }

  const configXml = buildConfigXml(origins);

  for (const xmlPath of xmlPaths) {
    if (fs.existsSync(xmlPath)) {
      fs.writeFileSync(xmlPath, configXml);
    }
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
