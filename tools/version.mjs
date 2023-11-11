import { resolve } from 'node:path';
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const path = resolve(__dirname, '..', 'package.json');
const content = JSON.parse(await readFile(path, 'utf8'));
const { version } = content;
const [major, minor, _] = version.split('.');
const newPatch = process.argv.pop();

if (isNaN(+newPatch)) {
  console.error(`The argument must be a new patch-level version number. Received: "${newPatch}".`);
  process.exit(1);
}

content.version = [major, minor, newPatch].join('.');
await writeFile(path, JSON.stringify(content, undefined, 2), 'utf8');
