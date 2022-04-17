const { resolve } = require('path');
const { writeFileSync, readFileSync } = require('fs');

const path = resolve(__dirname, '..', 'package.json');
const content = JSON.parse(readFileSync(path, 'utf8'));
const { version } = content;
const [major, minor, _] = version.split('.');
const newPatch = process.argv.pop();

if (isNaN(+newPatch)) {
  console.error(`The argument must be a new patch-level version number. Received: "${newPatch}".`);
  process.exit(1);
}

content.version = [major, minor, newPatch].join('.');
writeFileSync(path, JSON.stringify(content, undefined, 2), 'utf8');
