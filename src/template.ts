import { render } from 'ejs';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const _cache: Record<string, any> = {};

function getTemplate(templateName: string, extensionPath: string) {
  if (!(templateName in _cache)) {
    _cache[templateName] = readFileSync(resolve(extensionPath, 'src/templates/', templateName), 'utf-8');
  }

  return _cache[templateName];
}

export function getTemplateCode(extensionPath: string, templateName: string, data: any) {
  const template = getTemplate(templateName, extensionPath);
  return render(template, data);
}
