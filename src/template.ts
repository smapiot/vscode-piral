import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';

const _cache: any[string] = [];

export function getTemplateCode(extensionPath: string, templateName: string, data: any) {
  let template = _cache[templateName];

  if (!template) {
    template = _cache[templateName] =
      fs.readFileSync(
        path.join(extensionPath, 'src/templates/', templateName),
        'utf-8'
      );
  }

  return ejs.render(template, data);
};
