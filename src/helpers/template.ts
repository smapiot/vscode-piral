import { render } from 'ejs';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const _cache: Record<string, any> = {};

function getTemplate(baseDir: string, fileName: string) {
  if (!(fileName in _cache)) {
    _cache[fileName] = readFileSync(resolve(baseDir, 'media', fileName), 'utf-8');
  }

  return _cache[fileName];
}

export function getTemplateCode(extensionPath: string, templateName: string, data: any) {
  const template = getTemplate(extensionPath, `${templateName}.html.ejs`);
  return render(template, data);
}
