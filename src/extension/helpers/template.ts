import { Uri } from 'vscode';

export function getTemplateCode(scriptUrl: Uri) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUrl.toString()}"></script>
</body>
</html>`;
}
